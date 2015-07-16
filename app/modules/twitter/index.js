'use strict'

var twitter = {};

var redis = require('redis');
var redisClient = redis.createClient();

twitter.list = function *(next) {
    this.redis.select(3);

    var tweets = yield this.redis.zrange(['twitter:forward:twitter:all', 0, -1]);
    //console.log(tweets);
    //console.log(Object.prototype.toString.call(tweets));

    var data = {
        tweets: JSON.stringify(tweets.map(function (v) { return JSON.parse(v); }))
    }
    yield this.render('twitter/list', data);

    //yield *next;
}

twitter.management = function *(next) {
    var data = {};

    data.title = '';
    yield this.render('twitter/management', data);
}

module.exports = twitter;
