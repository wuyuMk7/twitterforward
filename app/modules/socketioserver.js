'use strict'

var http = require('http');
var socketio = require('socket.io');
var redis = require('redis');
//TODO: Change the redis connection from TCP localhost to Unix socket.
var redisClient = redis.createClient();

module.exports.run = function(app, sys) {
    http = http.Server(app.callback());
    var io = socketio(http);

    /* Twitter stream */
    function getTweet(socket) {
        var stream = sys.api.twitter.stream('statuses/filter', { track: 'k' })
        
        stream.on('tweet', function (tweet) {
            console.log(tweet);
            //TODO: Tweet JSON parser.
            socket.emit('twitter', tweet);
        });
    }

    io.on('connection', function(socket) {
        console.log('connection from: ', socket.request.connection._peername);    
        //socket.emit('twitter', 'test');
        getTweet(socket);
    });

    return http;
}
