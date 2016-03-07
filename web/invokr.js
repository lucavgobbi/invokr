/**
 * Created by lucavgobbi on 2016-02-27.
 */
(function (window) {
    "use strict";
    var _socket;
    var _registeredMethods;
    var _calledQueue = {};

    function generateCID() {
        return Math.floor(Math.random() + Math.random() * Math.random() * 15487451);
    }

    function responseReceived (data) {
        var flow = _calledQueue[data.cid];
        if (flow.type === 'callback') {
            flow.callback.apply(null, data.callbackArgs);
            delete _calledQueue[data.cid];
        } else if (flow.type === 'promise') {
            if (data.type === 'then') {
                flow.resolve.apply(null, data.promiseArgs);
            } else if (data.type === 'catch') {
                flow.reject.apply(null, data.promiseArgs);
            }
            delete _calledQueue[data.cid];
        }
    }

    function buildInvokrObj (methods) {
        _registeredMethods = methods;
        for (var property in _registeredMethods) {
            if (_registeredMethods.hasOwnProperty(property)) {
                var type = _registeredMethods[property].type;
                if (type === 'callback') {
                    invokr[property] = function () {
                        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                        var cid = generateCID();
                        _calledQueue[cid] = { type: 'callback', callback: args[args.length - 1] };
                        _socket.emit('invokr-callMethod', { name: this, cid: cid, params: args });
                    }.bind(property);
                } else if (type === 'promise') {
                    invokr[property] = function () {
                        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                        return new Promise (function (resolve, reject) {
                            var cid = generateCID();
                            _calledQueue[cid] = { type: 'promise', resolve: resolve, reject: reject };
                            _socket.emit('invokr-callMethod', { name: this, cid: cid, params: args });
                        }.bind(this));
                    }.bind(property);
                }
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