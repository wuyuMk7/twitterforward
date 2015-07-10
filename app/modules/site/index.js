'use strict'

var site = {};

site.index = function *(next) {
    yield *next;
}

module.exports = site;
