var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/', function (req, res) {
    const token = req.body.token;
    const userId = req.body.userId;
    const graphApiUrl = `https://graph.facebook.com/${userId}?fields=id,name,first_name,last_name&access_token=${token}`

    request(graphApiUrl, function (error, response, body) {
        body = JSON.parse(body);
        res.json(body);
    })
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);