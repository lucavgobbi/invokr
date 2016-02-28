/**
 * Created by lucavgobbi on 2016-02-27.
 */
(function (window) {
    "use strict";
    var _socket;
    var _registeredMethods;
    var _calledQueue = {};

    var invokr = {
        connect: function (address) {
            _socket = io(address);

            _socket.emit('invokr-getRegisteredMethods', {});

            _socket.on('invokr-registeredMethods', function (methods) {
                _registeredMethods = methods;
                _.each(_registeredMethods, function (o, k) {
                    if (o.type == 'callback') {
                        invokr[k] = function () {
                            var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                            var cid = Math.floor(Math.random() + Math.random() * Math.random() * 15487451);
                            _calledQueue[cid] = args[args.length - 1];
                            _socket.emit('invokr-callMethod', { name: k, cid: cid, params: args });
                        };
                    }
                })
            });
            _socket.on('invokr-responseMethod', function (data) {
                var callback = _calledQueue[data.cid];
                delete _calledQueue[data.cid];
                callback.apply(null, data.callbackArgs);
            });
        }
    };

    window.invokr = invokr;
}(window));