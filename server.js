var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/', function (req, res) {
    var userName = null;
    request('https://graph.facebook.com/10157907626725445?access_token=EAAZAap0qcmaUBADUGgpJ5vZAr1sD0vq0Q9OVHOLdlt8VI21Y2AcAAyjNcFiiDzOaDxlr4E4YlMMK5FhCeuZAompbHnZB8jQOuAPA0y3CbAHutyJMQDOsLfot8fjGWsFlv6Pk8w1rZB1SujdA5lWitKBghP9JsMcZBbro7mjlJBGscCB56Q8d4rWFXBS3tnKGAZD', function (error, response, body) {
        body = JSON.parse(body);
        userName = body.name;
        console.log(userName);
        res.json({ Bruker: userName });
    })
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);