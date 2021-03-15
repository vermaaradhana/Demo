var express = require('express');
var router = express.Router();
var moment = require('moment');
const Price = require('../models/disasterPrice');



router.post('/', getPrice);
router.post('/create', createPrice);
router.get('/edit/:id', editPrice);
router.patch('/update/:id', updatePrice);
router.delete('/delete/:id', deletePrice);



async function getPrice(req, res) {
    try {
        let payload=req.body
        let record = await Price.find({$and:[{"linguist":payload.linguist},{"minName":{$lte:payload.name}},{"maxName":{$gte:payload.name}}]}).sort({ "_id": -1 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            // const url = req.protocol + ':' + req.get('host') + '/upload/';
            const url = req.protocol + '/upload/';
            record.map(element => {
                element.filePath = url + element.fileName;
            })
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function createPrice(req, res) {
    try {
        let payload = req.body;
        const url = req.protocol + ':'
        let data = new Price({
            minName: payload.minName,
            maxName: payload.maxName,
            linguist: payload.linguist,
            price:payload.price,
            createdBy: req.user.id
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

async function editPrice(req, res) {
    try {
        let record = await Price.find({ "_id": req.params.id }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function updatePrice(req, res) {
    try {
        let payload = req.body;
        const url = req.protocol + ':' + req.get('host') + '/upload/';
        let data = {};
        if (payload.title) {
            data.title = req.body.title
        }
        if (payload.description) {
            data.description = req.body.description
        }
        if (req.file) {
            data.fileName = req.file.filename;
        }
        await Price.findByIdAndUpdate({ "_id": req.params.id }, { $set: data }).exec();
        res.status(201).send({ success: true, data: "Updated Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function deletePrice(req, res) {
    try {
        await Price.findByIdAndDelete({ "_id": req.params.id }).exec();
        res.status(201).send({ success: true, data: "Deleted Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
module.exports = router;