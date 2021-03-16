var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
var multer = require('multer');

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
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // }
});



router.get('/', get);
router.post('/create', upload.array('file',2), create);
router.get('/dataById/:id', dataById);

async function get(req, res) {
    try {
        let record = await Blog.find({}).sort({ "_id": -1 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            // const url = req.protocol + ':' + req.get('host') + '/upload/';
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function create(req, res) {
    try {
        let payload = req.body;
        const url = req.protocol + ':'
        let data = new Blog({
            comment: payload.comment,
            fileName: req.files[0].filename,
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

async function dataById(req, res) {
    try {
        let record = await Blog.find({ "_id": req.params.id }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

module.exports = router;