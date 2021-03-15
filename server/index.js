const http = require("http");
const path = require("path");
const express = require("express");
var cors = require('cors');
const bodyParser = require('body-parser');
// require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config/database');

//create app
const app = express();
app.use(cors());

mongoose.connect(config.database, {
    'useUnifiedTopology': true,
    'useNewUrlParser': true
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const mongo = mongoose.connection;

mongo.on('error', function() {
    console.error('MongoDB Connection Error. Please make sure that', config.database, 'is running.');
});

mongo.once('open', function callback() {
    console.info('Connected to MongoDB:', config.database);
});

const normalizePort = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//define port
// const port = normalizePort(process.env.PORT);
const port = 4000;
app.set("port", port);

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    limit: 52428800,
    extended: true,
    type: "application/x-www-form-urlencoded"
}));

// parse application/json
app.use(bodyParser.json({
    limit: 52428800,
    type: "application/json"
}));

//global routes settings
app.use(require("./routes/index"));

app.use('/upload', express.static('upload'));

//enable angular front end
app.use(express.static('../dist/brand-name-evaluation'));

//catch all unknown routes
app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/brand-name-evaluation/index.html'));
});

// server error listener
const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//server listening listener
const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    console.log("Listening on " + bind);
};

//create server with listeners
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);

//start server
server.listen(port);