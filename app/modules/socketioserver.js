'use strict'

var http = require('http');
var socketio = require('socket.io');
var redis = require('redis');
//TODO: Change the redis connection from TCP localhost to Unix socket.
var redisClient = redis.createClient();

module.exports.run = function(app, sys) {
    /*
     * socket.io Server
     * In this app, socket.io and koa use the same server.
     * You can also specify a sever for socket.io.
     * Comment three lines:
     *   http = http.Server(app.callback());
     *   var io = socketio(http);
     *  
     *   return http;
     * Then use:
     *   var io = socketio(sys.config.socketioserver.port);
     *
     *   return app;
     * Now the socketio server will create a new nodejs server i
     * and listen the port 'sys.config.socketioserver.port'.
     */
    http = http.Server(app.callback());
    var io = socketio(http);
    //var io = socketio(sys.config.socketioserver.port);

    /* Twitter stream */
    function getTweet() {
        var track = '';
        var follow = ['294025417'];
        //var follow = ['1962350898'];
        var stream = sys.api.twitter.stream('statuses/filter', { track: track, follow: follow });
        redisClient.select(3);

        io.of('/twitterForward').on('connection', function(socket) {
            //console.log('connection from: ', socket.request.connection._peername);    
            var address = socket.request.headers['x-forwarded-for'] || '';
            address = address + ' peer_' + JSON.stringify(socket.request.connection._peername);
            console.log('connection from: ', address);
            //socket.emit('twitter', 'test');
        });
        
        stream.on('tweet', function (tweet) {
            // tweet.retweeted_status : the original tweet info
            if (follow.indexOf(tweet.user.id_str) !== -1 && tweet.in_reply_to_status_id === null) {
                /* 
                 * Tweet JSON parser
                 * Used to get the info that we need after.
                 * Tweet: created_at, text, id, id_str
                 * User: id, name, profile_image_url 
                 */
                var tweetInfo = {
                    id: tweet.id, 
                    id_str: tweet.id_str,
                    text: tweet.text,
                    created_at: tweet.created_at,
                    user: {
                        id: tweet.user.id, 
                        name: tweet.user.name,
                        profile_image_url: tweet.user.profile_image_url,
                    },
                };
                //console.log(tweet);
                //console.log(tweetInfo);

                /*
                 * TODO: 
                 * Get tweet id and then put it into redis.
                 * Put it to twitter-XXX channel
                 */

                /*
                 * This app gets the tweets' id and abandon the tweet which is not from our followers.
                 * We also abadon the reply from our followers.
                 */
                var zaddArgs = ['twitter:forward:twitter:all', tweetInfo.id, JSON.stringify(tweetInfo)];
                redisClient.zadd(zaddArgs, redis.print);
                redisClient.zremrangebyrank(['twitter:forward:twitter:all', 0, -50], redis.print);
                io.of('/twitterForward').emit('twitter', tweetInfo);
            }
        });
    }
    getTweet();


    return http;
    //return app;
}
