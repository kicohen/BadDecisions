var express = require("express");
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 50000;

server = app.listen(port, function () {
    console.log('Server listening at port %d', port);
});

mongoose.connect('mongodb://production:test@ds113636.mlab.com:13636/baddecisions');

app.set("views", "views");
app.set('view engine', 'ejs');
app.use(morgan('short'));
app.use(express.static('public'));

var io = require('socket.io')(server);
var sockets = require("./sockets/sockets.js");
sockets.init(io);

app.get('/', function(req, res) {
    res.render('pages/index');
});