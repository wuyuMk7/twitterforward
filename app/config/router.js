'use strict'

var router = require('koa-router')();

module.exports = function(modules) {
    //Router root
    router.get('/', modules.site.index);
    
    //Router Site
    router
        .get('/site', modules.site.index)
        .get('/site/index', modules.site.index);
    
    //Router Twitter
    router.get('/twitter/list', modules.twitter.list);
    
    return router;
}

