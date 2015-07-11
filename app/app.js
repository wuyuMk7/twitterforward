'use strict'

//Modules for users
var modules = {
    site: require('./modules/site'),
    twitter: require('./modules/twitter')
};

var app = require('koa')();
var koaStatic = require('koa-static');
var koaHandlebars = require('koa-handlebars');

var sys = require('./config/init');
var router = require('./config/router')(modules); 

app.use(koaHandlebars(sys.config.handlebars));
app.use(router.routes());
app.use(koaStatic('public', {defer: false}));

var socketio = require('./modules/socketioserver');
var server = socketio.run(app);

module.exports = server;
