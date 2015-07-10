'use strict'

var twitter = {};

twitter.list = function *(next) {
    var data = {
        id: 1,
        text: '2333',
    }
    this.render('twitter/list', data);

    yield *next;
}

module.exports = twitter;
