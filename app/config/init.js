'use strict'

var config = require('./config');

function initApi() {
    var api = config.api;    
    var apiInstance = {};

    if(typeof api.twitter !== 'undefined') {
        var Twit = require('twit');
        var T = new Twit(api.twitter);
        apiInstance.twitter = T;
    }

    return apiInstance;
}

module.exports.config = config;
module.exports.api = initApi();
module.exports.init = function () {}
