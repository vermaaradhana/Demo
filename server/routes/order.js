var express = require('express');
var router = express.Router();
var moment = require('moment');
const Order = require('../models/order');
const Answer = require('../models/answer');
var multer = require('multer');
const fs = require('fs');
const Job = require('../models/job');
const csv = require('csvtojson');
const DIR = './upload/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

router.post("/create", upload.fields([{
    name: 'evaluationFile',
    maxCount: 1
}, {
    name: 'pronounciationGuide',
    maxCount: 1
},
{
    name: 'logosFile',
    maxCount: 12
}]), createOrder);
router.patch("/updateOrder/:id", upload.fields([{
    name: 'evaluationFile',
    maxCount: 1
}, {
    name: 'pronounciationGuide',
    maxCount: 1
},
{
    name: 'logosFile'
}]), updateOrder);
router.post("/createOrderForLogos", upload.array('logosFile', 12), createOrder);
router.get("/", GetAllRecord);
router.patch("/update/:id", updateOrderDetails);
router.get("/clientOrder", GetClientOrder);
router.get('/clientOrderById/:id', GetClientOrderById)
router.get("/getOrderById/:id", GetOrderById);
router.patch('/updatelinguist/:id', updateLinguistData);
router.patch("/createJob/:id", createJob);
router.get("/getJob", getJob);
router.post('/answer', enterAnswer);
router.get("/getJobdetail", getJobDetail);
router.get("/getJobById/:id", getJobById);
router.get("/getLinguistList/:id", getLinguistListById);


async function getJob(req, res) {
    try {
        // let data = await Order.find({ ttgJobNumber: { $exists: true } }).exec();
        let data = await Order.find({ "jobDetail": { $elemMatch: { "linguistAssigned": { $elemMatch: { $and: [{ "linguistId": Number(req.user.id), "status": { $ne: 'decline' } }] } } } } }).exec();
        data.map(a => {
            a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
        })
        res.status(201).send({ status: true, data: data });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetAllRecord(req, res) {
    try {
        let record = await Order.aggregate([{ $lookup: { from: 'user', localField: 'clientId', foreignField: '_id', as: 'ClientData' } }, { $project: { "ClientData.password": 0, "ClientData.role": 0, "ClientData.detail": 0, "ClientData.created_at": 0, "ClientData.updated_at": 0, "ClientData.__v": 0 } }]).sort({ "_id": -1 }).exec();
        record.map(a => {
            a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
        })
        res.status(201).send({ status: true, data: record });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetClientOrder(req, res) {
    try {
        let record = await Order.find({ "clientId": req.user.id }).sort({ "_id": -1 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "This client have no data to show" });
        } else {
            record.map(a => {
                a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
                a.createdAt = (a.createdAt !== null) ? moment(a.createdAt).format('MM/DD/YYYY') : "";
            });
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetClientOrderById(req, res) {
    try {
        let record = await Order.find({ "clientId": req.params.id }).sort({ "_id": -1 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: record });
        } else {
            record.map(a => {
                a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
                a.createdAt = (a.createdAt !== null) ? moment(a.createdAt).format('MM/DD/YYYY') : "";
            });
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetOrderById(req, res) {
    try {
        let id = Number(req.params.id);
        const url = req.protocol + ':' + '/upload/';
        let record = await Order.aggregate([{ $match: { "_id": id } }, { $lookup: { from: 'user', localField: 'clientId', foreignField: '_id', as: 'clientData' } }, { "$addFields": { 'clientName': '$clientData.name' } }, { "$addFields": { 'clientEmail': '$clientData.email' } }, { $lookup: { from: 'questionGroup', localField: 'evaluationQuestionGroupId', foreignField: '_id', as: 'questionGroupDetail' } }, { "$addFields": { 'questionGroupName': '$questionGroupDetail.questionGroupName' } }, { $project: { 'clientData': 0 } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            record.map(a => {
                a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
                a.createdAt = (a.createdAt !== null) ? moment(a.createdAt).format('MM/DD/YYYY') : "";
                if (a.fileName)
                    a.filepath = url + a.fileName;
                if (a.pronounciationGuide)
                    a.pronounciationFilePath = url + a.pronounciationGuide
            })
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function updateOrder(req, res) {
    try {
        let payload = req.body;
        let csvData = [];
        let fileName;
        let pronounciationGuideFileName;
        if (payload.evaluationString && typeof (payload.evaluationString) === 'string') {
            payload.evaluationString = payload.evaluationString.split(",")
        }
        if (req.files.evaluationFile) {
            const converter = await csv().fromFile(`${DIR}/${req.files.evaluationFile[0].filename}`).then(json => {
                json.forEach(val => {
                    csvData.push(val.name);
                })
            });
            fileName = req.files.evaluationFile[0].filename;
        }
        if (req.evaluationType === 'Logos') {
            fileName = req.files.logosFile[0].filename;
        }
        if (req.files.pronounciationGuide) {
            pronounciationGuideFileName = req.files.pronounciationGuide[0].filename;
        } else if (req.files.evaluationFile) {
            fileName = req.files.evaluationFile[0].filename;
        } else {
            pronounciationGuideFileName = payload.pronounciationGuide;
            fileName = payload.evaluationFile;
        }
        if (typeof (payload.selectedLanguages) === 'string') {
            payload.selectedLanguages = payload.selectedLanguages.split(',')
        }
        if (payload.variantLanguages && typeof (payload.variantLanguages) === 'string') {
            payload.variantLanguages = payload.variantLanguages.split(',');
        }
        let jobDetails = await createJobDetails(req);
        let newRecord = await Order.findById({ "_id": req.params.id }).exec();
        let jobData = jobDetails;
        if (newRecord.jobDetail) {
            newRecord.jobDetail.forEach(element => {
                jobData.forEach(value => {
                    if (value.language === element.language) {
                        value.linguistAssigned = element.linguistAssigned
                    }
                })
            })
        }
        const data = new Order({
            reference: payload.reference,
            clientId: payload.clientId,
            evaluationType: payload.evaluationType,
            selectedLanguages: payload.selectedLanguages,
            linguistSize: payload.linguistSize,
            variantLanguages: payload.variantLanguages,
            variantLinguistSize: payload.variantLinguistSize,
            evaluationString: payload.evaluationString,
            clientPo: payload.clientPo,
            primer: payload.primer,
            price: payload.price,
            instruction: payload.instruction,
            internalNote: payload.internalNote,
            anyGender: payload.anyGender,
            female: payload.female,
            male: payload.male,
            evaluationFile: fileName,
            pronounciationGuide: pronounciationGuideFileName,
            jobDetail: jobData,
            specialInstruction: payload.specialInstruction
        });
        if (payload.evaluationString === '' || payload.evaluationString === null || payload.evaluationString === 'null' || payload.evaluationString === undefined) {
            data.evaluationString = csvData;
        }
        Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: data }).exec((err, result) => {
            if (err) throw err;
            res.status(201).send({ success: true, message: "successfully created." })
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function createOrder(req, res) {
    try {
        let payload = req.body;
        let csvData = [];
        let fileName;
        let pronounciationGuide;
        if (req.files.evaluationFile) {
            const converter = await csv().fromFile(`${DIR}/${req.files.evaluationFile[0].filename}`).then(json => {
                json.forEach(val => {
                    csvData.push(val.name);
                })
            });
            fileName = req.files.evaluationFile[0].filename;
        } if (req.evaluationType === 'Logos') {
            fileName = req.files.logosFile[0].filename;
        }
        if (payload.evaluationString && typeof (payload.evaluationString) === 'string') {
            payload.evaluationString = payload.evaluationString.split(",");
        }
        if (req.files.pronounciationGuide) {
            pronounciationGuide = req.files.pronounciationGuide[0].filename;
        }
        if (typeof (payload.selectedLanguages) === 'string') {
            payload.selectedLanguages = payload.selectedLanguages.split(',')
        }
        if (payload.variantLanguages && typeof (payload.variantLanguages) === 'string') {
            payload.variantLanguages = payload.variantLanguages.split(',');
        }
        let jobDetails = await createJobDetails(req);
        const data = new Order({
            reference: payload.reference,
            clientId: payload.clientId,
            evaluationType: payload.evaluationType,
            selectedLanguages: payload.selectedLanguages,
            linguistSize: payload.linguistSize,
            variantLanguages: payload.variantLanguages,
            variantLinguistSize: payload.variantLinguistSize,
            evaluationString: payload.evaluationString,
            clientPo: payload.clientPo,
            primer: payload.primer,
            price: payload.price,
            instruction: payload.instruction,
            internalNote: payload.internalNote,
            status: 'To Do',
            anyGender: payload.anyGender,
            female: payload.female,
            male: payload.male,
            evaluationFile: fileName,
            pronounciationGuide: pronounciationGuide,
            specialInstruction: payload.specialInstruction,
            jobDetail: jobDetails,
            createdBy: req.user.id
        });
        if (payload.evaluationString === '' || payload.evaluationString === null || payload.evaluationString === 'null' || payload.evaluationString === undefined) {
            data.evaluationString = csvData;
        }
        data.save((err, result) => {
            if (err) throw err;
            res.status(201).send({ success: true, message: "successfully created." });
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
var languagesLinguistsMapping = [];

async function createJobDetails(req) {
    var LinguistSize;
    languagesLinguistsMapping = [];
    if (req.body.variantLinguistSize) {
        LinguistSize = Number(req.body.variantLinguistSize);
    } else {
        LinguistSize = Number(req.body.linguistSize);
    }
    req.body.selectedLanguages.forEach(element => {
        let linguistSize, language;
        if (req.body.variantLanguages.length != 0) {
            for (let i = 0; i < req.body.variantLanguages.length; i++) {
                const value = req.body.variantLanguages[i];
                if (req.body.variantLanguages.includes(element)) {
                    language = element;
                    linguistSize = Number(req.body.variantLinguistSize);
                    insertLinguist(language, linguistSize);
                } else if (!req.body.variantLanguages.includes(element)) {
                    linguistSize = Number(req.body.linguistSize);
                    language = element;
                    insertLinguist(language, linguistSize);

                }
                if (!req.body.selectedLanguages.includes(value)) {
                    linguistSize = Number(req.body.variantLinguistSize);
                    language = value;
                    insertLinguist(language, linguistSize);
                }
                break;
            };
        } else {
            language = element;
            linguistSize = Number(req.body.linguistSize);
            insertLinguist(language, linguistSize);
        }
    });
    return languagesLinguistsMapping;
}

async function insertLinguist(language, linguistSize) {
    let jobDetails = {
        language: language,
        linguistRequired: linguistSize,
        linguistsAssigned: []
    }
    let conditionCheck = false;
    languagesLinguistsMapping.forEach(element => {
        if (element.language == language)
            conditionCheck = true
    });
    if (!conditionCheck) {
        languagesLinguistsMapping.push(jobDetails);
    }
}

async function updateOrderDetails(req, res) {
    try {
        let payload = req.body;
        await Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }).exec();
        res.status(201).send({ success: true, message: "successfully Updated." });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function updateLinguistData(req, res) {
    try {
        let payload = req.body;
        let linguistarray = [];
        let data = await Order.find({ "_id": req.params.id }).exec();
        data[0].linguistDetail.forEach(element => {
            if (element === payload.linguistDetail)
                linguistarray.push(element);
        });
        linguistarray.push(payload.linguistDetail);
        await Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: { linguistDetail: linguistarray } }).exec();
        res.status(201).send({ status: true, message: "Updated Successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function createJob(req, res) {
    try {
        await Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: req.body }).exec();
        res.status(201).send({ success: true, message: "Created Successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function enterAnswer(req, res) {
    try {
        let payload = req.body;
        let data = new Answer({
            linguistId: payload.linguistId,
            questionGroupId: payload.questionGroupId,
            orderId: payload.orderId,
            answer: payload.answerDetails,
        });
        await data.save().then(async result => {
            let orderData = await Order.find({ "_id": payload.orderId }, { "linguistSize": 1, "variantLinguistSize": 1 }).exec();
            let AnswerData = await Answer.find({ "orderId": payload.orderId }).exec();
            let linguistSize = orderData[0].linguistSize;
            let variantLinguistSize = orderData[0].variantLinguistSize;

            if (variantLinguistSize) {
                linguistSize = linguistSize + variantLinguistSize;
            }
            let status = (linguistSize == AnswerData.length) ? 'completed' : 'in progress';
            await Order.findByIdAndUpdate({ "_id": payload.orderId }, { "status": status }).exec();
            res.status(201).send({ success: true, message: "Answerd entered  Successfully" });
        }).catch((error) => {
            res.status(500).send({ status: false, message: error.message });
        })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function getJobDetail(req, res) {
    try {
        let record = await Order.aggregate([{ $lookup: { from: 'questionGroup', localField: 'evaluationQuestionGroupId', foreignField: '_id', as: 'Question' } }, { $lookup: { from: 'answer', localField: '_id', foreignField: 'orderId', as: 'AnswerData' } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function getJobById(req, res) {
    try {
        let id = Number(req.params.id)
        let record = await Order.aggregate([{ $match: { "_id": id } }, { $lookup: { from: 'user', localField: 'clientId', foreignField: '_id', as: 'clientData' } }, { "$addFields": { 'clientName': '$clientData.name' } }, { $project: { 'clientData': 0 } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function getLinguistListById(req, res) {
    try {
        let id = Number(req.params.id)
        let record = await Order.aggregate([{ $match: { "_id": id } }, { $lookup: { from: 'user', localField: 'jobDetail.linguistAssigned.linguistId', foreignField: '_id', as: 'linguistData' } }, { $project: { "linguistData.password": 0 } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = router;