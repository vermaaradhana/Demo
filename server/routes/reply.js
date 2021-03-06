var express = require('express');
var router = express.Router();
const Reply = require('../models/reply');



router.post('/', getReply);
router.post('/create', createReply);
router.get('/edit/:id', editReply);
router.patch('/update/:id', updateReply);
router.delete('/delete/:id', deleteReply);



async function getReply(req, res) {
    try {
        let payload=req.body
        let record = await Reply.aggregate([{ $match: { "blogId": payload.id } }, { $lookup: { from: 'user', localField: 'commentBy', foreignField: '_id', as: 'userData' } },  { "$addFields": { 'username': '$userData.username' } },{ $lookup: { from: 'blog', localField: 'blogId', foreignField: '_id', as: 'blogData' } }, { $project: { 'userData': 0 } },  { "$addFields": { 'blogCreatedBy': '$blogData.createdBy' } }]).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function createReply(req, res) {
    try {
        let payload = req.body;
        const url = req.protocol + ':'
        let data = new Reply({
            blogId: payload.blogId,
            msg: payload.msg,
            commentBy: req.user.id
        })
        data.save().then(result => {
            res.status(201).send({ success: true, message: "created successfully" });
        }).catch(error => {
            res.status(500).send({ success: false, message: error.message });
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function editReply(req, res) {
    try {
        let record = await Reply.find({ "_id": req.params.id }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function updateReply(req, res) {
    try {
        let payload = req.body;
        await Reply.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }).exec();
        res.status(201).send({ success: true, data: "Updated Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function deleteReply(req, res) {
    try {
        await Reply.findByIdAndDelete({ "_id": req.params.id }).exec();
        res.status(201).send({ success: true, data: "Deleted Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
module.exports = router;