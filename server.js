var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

var apiRouter = require('./apiRouter');

var app = express();
var router = express.Router();
mongoose.connect('mongodb://localhost:27017/baracz');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRouter(router));

app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'Something failed' })
});

app.listen(8080);

console.log('Magic happens on port ' + 8080);