var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const mailHistory = require('../models/mailHistory');

sgMail.setApiKey('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');

router.post("/sendLinguistMail",  sendMail);
router.post("/sendProposalMail", sendProposalMail);
router.get('/getMailList', getMailList);

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(404).send({ message: "Token Not Found" });
    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.status(403).send({ message: "Invalid Token" });
        req.user = user
        next();
    });
}

async function sendMail(req, res) {
    // to.push({ name: 'Aradhana', email: 'aradhana.verma@webhungers.com' })
    const msg = {
        to: req.body.to, // Change to your recipient
        from: 'aradhana.verma@webhungers.com', // Change to your verified sender
        subject: `You have a new msg from ${req.user.name}`,
        text: "Hello",
        html: `${req.body.msg}`,
    }
    let data = new mailHistory({
        to: req.body.to,
        msg: req.body.msg,
        sendTo: req.body.sendTo,
        receiverName: req.body.receiverName,
        sendBy: req.user.id
    })
    sgMail.send(msg).then(async() => {
            await data.save((err, result) => {
                if (err) throw err;
                res.status(201).send({ success: true, message: "successfully created." });
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ message: error });
        })
}

async function sendProposalMail(req, res) {
    const msg = {
        to: req.body.to, // Change to your recipient
        from: 'aradhana.verma@webhungers.com', // Change to your verified sender
        subject: `You have a new msg from ${req.user.name}`,
        text: "Hello",
        html: `${req.body.msg}`,
    }
    sgMail.send(msg).then(async() => {
            res.status(201).send({ success: true, message: "successfully created." });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send({ message: 'error' });
        })
}

async function getMailList(req, res) {
    try {
        let result = [];
        sendToType = ['Single', 'Group', 'All'];
        await sendToType.forEach(async element => {
            let data = await mailHistory.find({ 'sendTo': element }).limit(1).sort({ "_id": -1 }).exec();
            if (data.length > 0) {
                result.push(data[0])
            }
            if (element == 'All') {
                res.status(201).send({ success: true, data: result });
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = router;