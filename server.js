let bodyParser = require('body-parser');
let express = require('express');
let mongoose = require('mongoose');
let morgan = require('morgan');
let request = require('request');
global.config = require('./config');

let authRouter = require('./router/authRouter');
let apiRouter = require('./router/apiRouter');
let verifyToken = require('./middleware/verifyToken');

let app = express();
let router = express.Router();
mongoose.connect('mongodb://localhost:27017/baracz');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/auth', authRouter(router));
app.use('/api', verifyToken, apiRouter(router));

app.use(function (err, req, res, next) {
    res.status(500).send({ error: err })
});

app.listen(8080);

console.log('Magic happens on port ' + 8080);