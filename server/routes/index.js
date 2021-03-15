const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

// const authRoutes = require("./auth");
const user = require("./user");
const blog = require('./blog');

app.use("/user", user);
app.use("/blog", blog);

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