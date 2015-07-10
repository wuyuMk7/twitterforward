'use strict'

var http = require('http');
var socketio = require('socket.io');

module.exports.run = function(app) {
    http = http.Server(app.callback());
    var io = socketio(http);

    io.on('connection', function() {
       console.log('co');    
    });

    return http;
}
