const express = require('express');
const https = require('https')
const http = require('http')
const config = require('./config');
const authenticate = require('./utils/auth');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');


// supply key and crt
const options = {
  key: '',
  cert: '',
}

// create app
const app = express();

// connect db
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
  .catch(err => {
    console.log('mongo connection failed, exiting...');
    process.exit(1);
  });

// add middleware
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//adding body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// our own middle ware
app.use(auth.authenticate);

// init models
require('./models');

// stick routes
require('./routes/test.route')(app);

// listen and serve
http.createServer(app).listen(config.port)
https.createServer(options, app).listen(443)