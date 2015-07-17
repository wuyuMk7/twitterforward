//var tweets = [
//    { id: '1', text: '233' },
//    { id: '2', text: '345' },
//]; 

$(function () {
    var Tweet = React.createClass({
        render: function () {
            return (
                <div className="comment">
                    <a className="avatar">
                        <img src={ this.props.user.profile_image_url } />
                    </a>
                    <div className="content">
                        <a className="author"> { this.props.user.name }</a>
                        <div className="metadata">
                            <div className="date">{ this.props.time }</div>
                        </div>
                        <div className="text">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            ); 
        }                              
    });
    
    var TweetList = React.createClass({
        getInitialState: function () {
            return {
                tweets: this.props.data,
                count: this.props.data.length,
            };
        },
        componentDidMount: function () {
            // Default socketio server:
            // var socket = io.connect('/twitterForward');
            // Because I use cloudflare, so I need set a subdomain for ws.
            var socket = io.connect('socket.' + window.location.hostname + '/twitterForward');
            var s = this;
            socket.on('twitter', function(tweet) {
                var newTweets = s.state.tweets;
                newTweets.unshift(tweet);
                s.setState({
                    //tweets: this.state.tweets.unshift(tweet),
                    //data: this.state.data + 1
                    tweets: newTweets,
                    count: s.state.count + 1
                })
            });
        },
        render: function () {
            var tweets = this.state.tweets.map(function(tweet) {
                return (
                    <Tweet id={tweet.id} user={tweet.user} time={tweet.created_at}>         
                        { tweet.text }
                    </Tweet>
                );                                 
            });
            return (
                <div className="ui comments">
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

