
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// the secret is used both to 'sign' and 'verify' the jwt
var secret = 'SecretsAreFun!!!';

var app = express();

// make sure we can parse incoming POST data
app.use(require('body-parser')());

// 1. we start here at the login page, fill in 'user' for the username to become authorized
app.get('/', function(req, res, next) {
  res.sendfile('login.html');
});

// 2. authorize user based on what they pass in
app.post('/login', function(req, res, next) {
  if(req.body.username === 'user') {
    var user = {name: 'Yo Dude'};
    var token = jwt.sign(user, secret);
    res.send('<a href="/api/find?token='+token+'">authorized</a>');
  }
  res.send('<a href="/api/find">unauthorized</a>')
});

// the following method is nothing more than to 'fake' the token being in the Authorization header of the request
app.get('/api/find', function(req, res, next) {
  var jwtoken = req.query.token;
  req.headers.authorization = 'Bearer ' + jwtoken;
  next()
});

// 3. verify that we have a legit jwt and decode it to the req.user field
app.use('/api', expressJwt({secret: secret}));

// 4. everything is all good, return the decoded req.user from the jwt
app.get('/api/find', function(req, res, next) {
  res.send(req.user);
});

app.listen(process.env.PORT || 3000);
