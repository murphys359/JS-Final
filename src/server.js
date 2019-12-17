'use strict';

var express = require('express');

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('dist'));
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

//receving post request url and phone number 
app.post('/send_sms', async (req, res) => {
	console.log(req.body);
	try {
    const msg = await client.messages.create({
        body: 'Here\'s your dog!',
        to: '+1' + req.body.phone,  // Text this number
        mediaUrl: [req.body.url], // Dog photo
        from: process.env.TWILIO_PHONE_NUMBER // From a valid Twilio number - use environment variables - set up info wout leaking info to source code, helps keep phone number secret
    });
    res.end(JSON.stringify({
        'status': 'success'
    }));
} catch(e) {
    res.end(JSON.stringify({
        'status': 'failure'
    }));
}
})


app.listen(5000);

