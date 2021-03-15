var express = require('express');
var router = express.Router();
var moment = require('moment');
const Question = require('../models/question');

router.get("/", getQuestion);
router.post("/create", createQuestion);
router.post("/questionListByType", questionListByType);
router.get("/getById/:id", getQuestionById);
router.delete("/delete/:id", deleteQuestion);
router.patch("/update/:id", updateQuestion);


async function getQuestion(req, res) {
    try {
        let record = await Question.find({}).sort({ "_id": -1 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function createQuestion(req, res) {
    try {
        let payload = req.body;
        let newRecord = new Question({
            questionGroupName: payload.questionGroupName,
            evaluationType: payload.evaluationType,
            question: payload.question,
            createdBy: req.user.id
        });
        newRecord.save((err, result) => {
            if (err) throw err;
            res.status(201).send({ success: true, message: "Created successfully" });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function getQuestionById(req, res) {
    try {
        let data = await Question.find({ "_id": req.params.id }).sort({ "_id": -1 }).exec();
        res.status(201).send({ success: true, data: data });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function deleteQuestion(req, res) {
    try {
        let data = await Question.findByIdAndRemove({ "_id": req.params.id }).exec();
        res.status(201).send({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function updateQuestion(req, res) {
    try {
        let payload = req.body;
        let data = await Question.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }, { new: true }).exec();
        res.status(201).send({ success: true, message: "Updated successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function questionListByType(req, res) {
    try {
        let payload = req.body;
        let data = await Question.find({ "evaluationType": req.body.evaluationType }).exec();
        res.status(201).send({ success: true, data: data });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
module.exports = router;