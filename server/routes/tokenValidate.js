var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

router.get("/", authenticateToken);

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(404).send({ message: "Token Not Found" })
    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.status(403).send({ message: "Invalid Token" })
        req.user = user
        return res.status(200).send({ message: "Token is valid" })
    });
}

module.exports = router;