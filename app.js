
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var secret = 'SecretsAreFun!!!';

var app = express();

app.use(require('body-parser')());

app.get('/', function(req, res, next) {
  res.sendfile('login.html');
});

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

app.use('/api', expressJwt({secret: secret}));

app.get('/api/find', function(req, res, next) {
  res.send(req.user);
});

app.listen(process.env.PORT || 3000);
