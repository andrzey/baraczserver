var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var User = require('./model/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/baracz');

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/', function (req, res) {
    const token = req.body.token;
    const userId = req.body.userId;
    const graphApiUrl = `https://graph.facebook.com/${userId}?fields=id,name,first_name,last_name&access_token=${token}`

    request(graphApiUrl, function (error, response, body) {
        body = JSON.parse(body);

        const user = new User({
            userid: body.id,
            firstname: body.first_name,
            lastname: body.last_name,
        });

        user.save((err, user) => {
            if (err) return console.error(err);
        });
        res.status(200).send(body);
        //res.json(body);
    })
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);