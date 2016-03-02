/**
 * Created by lucavgobbi on 2016-02-23.
 */
"use strict"

let registeredMethods = {};

const callMethod = function callMethod (name) {
    const allArgs = (arguments.length === 1?[arguments[0]]:Array.apply(null, arguments));
    const args = allArgs[1];
    const method = getMethod(name);

    if (method.type == 'callback') {
        args[args.length - 1] = returnCallback;
        method.func.apply(null, args);
    }
};

const getMethod = function getMethod (name) {
    if (name) {
        return registeredMethods[name];
    }
    return registeredMethods;
};

const addMethod = function addMethod (obj) {
    const type = obj.type || 'callback';
    registeredMethods[obj.name] = { func: obj.func, type: type };
};

module.exports = {
    addMethod: addMethod,
    getMethod: getMethod,
    callMethod: callMethod
};