var express = require('express');
var router = express.Router();
var moment = require('moment');
const Order = require('../models/order');
const Answer = require('../models/answer');
const fs = require('fs');
const Job = require('../models/job');
const csv = require('csvtojson');

router.get("/", GetAllRecord);
router.patch("/edit/:id", EditOrder);
router.get("/clientOrder", GetClientOrder);
router.get("/getOrderById/:id", GetOrderById);
router.patch('/updatelinguist/:id', updateLinguistData);
router.patch("/createJob/:id", createJob);
router.patch("/updateJob/:id", updateJob);
router.get("/getJob", getJob);
router.post('/answer', enterAnswer);
router.get("/getJobdetail", getJobDetail);
router.get("/getJobById/:id", getJobById);

async function getJob(req, res) {
    try {
        let data = await Order.find({ ttgJobNumber: { $exists: true } }).exec();
        res.status(201).send({ status: true, data: data });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetAllRecord(req, res) {
    try {
        let data = await Order.aggregate([{ $lookup: { from: 'user', localField: 'clientId', foreignField: '_id', as: 'ClientData' } }, { $project: { "ClientData.password": 0, "ClientData.role": 0, "ClientData.detail": 0, "ClientData.created_at": 0, "ClientData.updated_at": 0, "ClientData.__v": 0 } }]).sort({ "_id": -1 }).exec();
        data.map(a => {
            a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
            a.createdAt = (a.createdAt !== null) ? moment(a.createdAt).format('MM/DD/YYYY') : "";
        })
        res.status(201).send({ status: true, data: data });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function GetClientOrder(req, res) {
    try {
        let record = await Order.find({ "clientId": req.body.id }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
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
            record.map(element => {
                element.clientDueDate = (element.clientDueDate !== null) ? moment(element.clientDueDate).format('MM/DD/YYYY') : "";
                element.createdAt = (element.createdAt !== null) ? moment(element.createdAt).format('MM/DD/YYYY') : "";
                if (element.fileName)
                    element.filepath = url + element.fileName;
                if (element.pronounciationGuide)
                    element.pronounciationFilePath = url + element.pronounciationGuide
            })
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function EditOrder(req, res) {
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
        let payload = req.body;
        const data = new Job({
            evaluationQuestionGroupId: payload.evaluationQuestionGroupId,
            ttgJobNumber: payload.ttgJobNumber,
            clientDueDate: payload.clientDueDate,
            rateBreakdown: payload.rateBreakdown,
            specialInstruction: payload.specialInstruction,
            clientId: payload.clientId,
            orderId: payload.orderId,
            primer: payload.primer,
            nameSize: payload.nameSize,
            linguistSize: payload.linguistSize,
            jobDetail: payload.jobDetail,
            price: payload.price,
            status: "In Progress",
            createdBy: req.user.id
        });
        await data.save().then(async result => {

                let updateOrder = {
                    ttgJobNumber: payload.ttgJobNumber,
                    clientDueDate: payload.clientDueDate,
                    rateBreakdown: payload.rateBreakdown,
                    jobDetail: payload.jobDetail,
                    evaluationQuestionGroupId: payload.evaluationQuestionGroupId,
                    price: payload.price,
                    instruction: payload.comments,
                    jobId: result._id,
                    status: "In Progress",
                }
                await Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: updateOrder }).exec();
            })
            // await Order.findByIdAndUpdate({ "_id": req.params.id }, { $set: req.body }).exec();
        res.status(201).send({ success: true, message: "Created Successfully" });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

async function updateJob(req, res) {
    try {
        let payload = req.body;
        await Job.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }).exec();
        await Order.findOneAndUpdate({ 'jobId': req.params.id }, { $set: payload }).exec();
        res.status(201).send({ success: true, message: "successfully Updated." });

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
            record.map(a => {
                a.clientDueDate = (a.clientDueDate !== null) ? moment(a.clientDueDate).format('MM/DD/YYYY') : "";
                a.createdAt = (a.createdAt !== null) ? moment(a.createdAt).format('MM/DD/YYYY') : "";
            });
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function getJobById(req, res) {
    try {
        let id = Number(req.params.id)
        let record = await Order.aggregate([{ $match: { "orderId": id } }, { $lookup: { from: 'user', localField: 'clientId', foreignField: '_id', as: 'clientData' } }, { "$addFields": { 'clientName': '$clientData.name' } }, { $project: { 'clientData': 0 } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
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


module.exports = router;