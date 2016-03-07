/**
 * Created by lucavgobbi on 2016-02-23.
 */
"use strict"

let registeredMethods = {};

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
    getMethod: getMethod
};