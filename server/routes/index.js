const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// const authRoutes = require("./auth");
const user = require("./user");
const order = require("./order");
const question = require("./question");
const reference = require("./reference");
const token = require("./tokenValidate");
const mail = require("./mailSender");
const job = require('./job');
const price = require('./price');

app.use("/user", user);
app.use("/order", authenticateToken, order);
app.use("/question", authenticateToken, question);
app.use("/reference", authenticateToken, reference);
app.use("/job", authenticateToken, job);
app.use("/mail",authenticateToken, mail);
app.use("/price",authenticateToken, price);

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    let tokenList = authHeader && authHeader.split(' ');
    const token = tokenList[tokenList.length - 1];
    if (token == null) return res.status(404).send({ message: "Token Not Found" })
    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.status(403).send({ message: "Invalid Token" })
        req.user = user
        next();
    });
}


module.exports = app;