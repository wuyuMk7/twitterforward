//var tweets = [
//    { id: '1', text: '233' },
//    { id: '2', text: '345' },
//]; 

$(function () {
    // Default socketio server:
    // var socket = io.connect('/twitterForward');
    // Because I use cloudflare, so I need set a subdomain for ws.
    var socket = io.connect('socket.' + window.location.hostname + '/twitterForward');
    socket.on('twitter', function(msg) {
        console.log('new:', msg);
    });

    var Tweet = React.createClass({
        render: function () {
            return (
                <ul>         
                    <li> { this.props.user.name } </li>
                    <li> { this.props.user.profile_image_url } </li>
                    <li> { this.props.time } </li>
                    <li> { this.props.children }</li>
                </ul>
            ); 
        }                              
    });
    
    var TweetList = React.createClass({
        getInitialState: function () {
            return {
                newTweet: '',
            };
        },
        render: function () {
            var tweets = this.props.data.map(function(tweet) {
                return (
                    <Tweet id={tweet.id} user={tweet.user} time={tweet.created_at}>         
                        { tweet.text }
                    </Tweet>
                );                                 
            });
            return (
                <div>
                    { tweets }
                </div>
            ); 
        }
    });
    
    React.render(
        <TweetList data={tweets} />, 
        document.getElementById('tweets')
    );
});

