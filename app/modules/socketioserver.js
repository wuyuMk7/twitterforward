'use strict'

var http = require('http');
var socketio = require('socket.io');

module.exports.run = function(app, config) {
    http = http.Server(app.callback());
    var io = socketio(http);

    io.on('connection', function(socket) {
        console.log('connection from: ', socket.request.connection._peername);    
        socket.emit('twitter', 'test');
    });

    return http;
}
