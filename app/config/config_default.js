'use strict'

var server {
    default: { 
      port: 8923 
    },
    development: {
    },
}
var handlebars = {
    layoutsDir: "app/views/layouts",
    defaultLayout: "main",
    partialsDir: "app/views/partials",
    viewsDir: "app/views",
}
var database = [
    {
      driver: "", 
      desc: "",
      default: [],
      development: [],
      test: [],
      production: []
    },
]

var api = {
    twitter: {
        consumer_key: '',
        consumer_secret: '',
        access_token: '',
        access_token_secret: ''
    },
}

var config = {};
config.server = server;
config.handlebars = handlebars;
config.database = database;
module.exports = config;
