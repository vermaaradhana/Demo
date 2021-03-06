var express = require('express');
var router = express.Router();
var moment = require('moment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

router.post('/create', createUser);
router.post('/login', Login);
router.post('/', authenticateToken, GetAllRecord);
router.get('/userById/:id', authenticateToken, getUserById);

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let tokenList = authHeader && authHeader.split(' ');
    const token = tokenList[tokenList.length - 1];
    if (token == null) return res.status(404).send({ message: "Token Not Found" });
    jwt.verify(token, "secret", (err, user) => {
        if (err)
            return res.status(403).send({ message: "Invalid Token" });
        req.user = user
        next();
    })
}

async function createUser(req, res) {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        user.save((err, result) => {
            if (err) throw err;
            res.status(201).send({ success: true, message: "created Successfully!" });
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

async function Login(req, res) {
    try {
        let data = await User.find({ "email": req.body.email }).exec();
        if (data.length != 0) {
            bcrypt.compare(req.body.password, data[0].password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    let info = { "id": data[0]._id, "username": data[0].username, "email": data[0].email }
                    var token = jwt.sign(info, 'secret', { expiresIn: 86400 });
                    res.status(201).send({ success: true, data: info, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: false, message: "Authenication failed, Wrong Password" });
                }
            })
        } else {
            res.status(404).send({ success: false, message: "Authenication failed, Wrong User" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

async function ChangePassword(req, res) {
    try {
        let payload = req.body;
        let data = await User.find({ "_id": req.params.id }).exec();
        if (data.length != 0) {
            bcrypt.compare(req.body.oldPassword, data[0].password, async function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    await bcrypt.genSalt(10, function (err, salt) {
                        if (err) throw err;
                        bcrypt.hash(payload.newPassword, salt, null, function (err, hash) {
                            if (err) throw err;
                            payload.newPassword = hash;
                        });
                    });
                    await User.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }, { new: true }).exec();
                    res.status(201).send({ success: true, message: "Password updated succesfully" });
                } else {
                    res.status(401).send({ success: false, message: "Authenication failed, Current password doesn't match" });
                }
            })
        } else {
            res.status(404).send({ success: false, message: "Authenication failed, Wrong User" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

async function Delete(req, res) {
    try {
        await User.findByIdAndDelete({ "_id": req.params.id }).exec();
        res.status(201).send({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function Update(req, res) {
    try {
        let payload = req.body;
        await User.findByIdAndUpdate({ "_id": req.params.id }, { $set: payload }, { new: true }).exec();
        res.status(201).send({ success: true, message: "Updated Successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

async function GetAllRecord(req, res) {
    try {
        let record = await User.find({}, { password: 0 }).exec();
        if (record.length == 0) {
            res.status(201).send({ success: true, data: "No data to show" });
        } else {
            res.status(201).send({ success: true, data: record });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

async function getUserById(req, res) {
    try {
        let record = await User.find({ "_id": req.params.id }, { password: 0, role: 0 }).exec();
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