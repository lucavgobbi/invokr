/**
 * Created by lucavgobbi on 2016-02-24.
 */
var app = require('express')();
var server = require('http').Server(app);
var invokr = require('../bin/invokr');

server.listen(3000);

app.get('/', function (req, res) {
    res.send('Ok');
});

const echo = function echo (text, callback) {
    callback(null, text);
};

const sum = function (number1, number2, callback) {
    if (isNaN(number1) || isNaN(number2)) {
        return callback('Is not a number');
    }
    callback(null, number1 + number2)
};

invokr.addMethod({ name: 'echo', func: echo, type: 'callback' });
invokr.addMethod({ name: 'sum', func: sum, type: 'callback' });

invokr.attachToServer(server);
