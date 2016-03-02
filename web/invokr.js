/**
 * Created by lucavgobbi on 2016-02-27.
 */
(function (window) {
    "use strict";
    var _socket;
    var _registeredMethods;
    var _calledQueue = {};

    function responseReceived (data) {
        var callback = _calledQueue[data.cid];
        delete _calledQueue[data.cid];
        callback.apply(null, data.callbackArgs);
    }

    function buildInvokrObj (methods) {
        _registeredMethods = methods;
        for (var property in _registeredMethods) {
            if (_registeredMethods.hasOwnProperty(property)) {
                invokr[property] = function () {
                    var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                    var cid = Math.floor(Math.random() + Math.random() * Math.random() * 15487451);
                    _calledQueue[cid] = args[args.length - 1];
                    _socket.emit('invokr-callMethod', { name: this, cid: cid, params: args });
                }.bind(property);
            }
        }
    }

    var invokr = {
        connect: function (address) {
            _socket = io(address);

            _socket.emit('invokr-getRegisteredMethods', {});

            _socket.on('invokr-registeredMethods', buildInvokrObj);
            _socket.on('invokr-responseMethod', responseReceived);
        }
    };

    window.invokr = invokr;
}(window));