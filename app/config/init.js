'use strict'

var config = require('./config');

var redis = require('redis'),
    coRedis = require('co-redis');

var dbInitFunction = {
    redis: function (config, ctx) {
        var ctxTmp = ctx;
        if (typeof config.unix_socket !== 'undefined' && config.unix_socket != '') {
            ctx.redis = coRedis(redis.createClient(config.unix_socket, config));
        } else {
            var host = config.host || 'localhost';
            var port = config.port || '6379';
            ctx.redis = coRedis(redis.createClient(port, host, config));
        }   
        ctx.redis.onBase = function onBase(baseName) {
            ctxTmp.redis.select(baseName) ;
            return ctxTmp.redis;
        }
    }
}

function combineConfig(def, up) {
    for (var k in up) {
        def[k] = up[k];
    }

    return def;
}

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
module.exports.init = function (app) {
    var dbInit = {};
    var dbConfig = config.database;
    var dbLength = dbConfig.length;
    for (var i = 0; i < dbLength; ++i) {
        var curConfig = combineConfig(dbConfig[i].default, dbConfig[i][app.env]);
        dbInit[dbConfig[i].driver] = curConfig;
    }

    return function *(next) {
        /*
         * DB Init 
         * depends on drivers: redis, pg, mongo...
         * and env: development, test, production
         */
        for (var k in dbInit) {
            dbInitFunction[k](dbInit[k], this);
        }
        yield *next;
    
    }
}
