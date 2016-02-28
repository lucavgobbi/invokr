/**
 * Created by lucavgobbi on 2016-02-23.
 */
"use strict"

const register = require('./register');

let io = null;

function returnCallback () {
    const args = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
    this.socket.emit('invokr-responseMethod', { cid: this.cid, callbackArgs: args });
}

function processMethod(msg, socket) {
    const method = register.getMethod(msg.name);

    if (method.type == 'callback') {
        msg.params[msg.params.length - 1] = returnCallback.bind({ socket: socket, cid: msg.cid });
        method.func.apply(null, msg.params);
    }
}

const attachToServer = function attachToServer(server) {
    "use strict";
    io = require('socket.io')(server);

    io.on('connection', function(socket){
        socket.on('invokr-getRegisteredMethods', function () {
            socket.emit('invokr-registeredMethods', register.getMethod());
        });

        socket.on('invokr-callMethod', function (msg) {
            processMethod(msg, socket);
        });
    });
};

module.exports = {
    attachToServer: attachToServer,
    addMethod: register.addMethod,
    callMethod: register.callMethod,
    getMethod: register.getMethod
};