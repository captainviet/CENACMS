/**
 * Created by QuangNgo on 22/3/16.
 */

var pageId = '1675747249379266';
var pageAccessToken;

function generateFacebookPost() {
    var type = $('#incident').val();
    var content = $('#content').val();
    var publishMessage = 'Incident type ' + type + ' happened!\n'
        + 'Details: ' + content;
    return publishMessage;
}

function publishToFacebook(publishMessage) {
    FB.api('/me/accounts/', function(response) {
        for (var i = 0; i<response.data.length; i++) {
            if (response.data[i].id === pageId) {
                pageAccessToken = response.data[i].access_token;
                break;
            }
        }
        console.log(pageAccessToken);
        FB.api('/me/feed/', 'post', {
            access_token: pageAccessToken,
            message: publishMessage
        }, function(response) {
            console.log(response);
        })
    });
}

if (Meteor.isClient) {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1046795818712640',
            xfbml      : true,
            version    : 'v2.5'
        });
    };



    Template.social.events({
        'click #publishBtn': function (event) {
            event.preventDefault();
            var publishMessage = generateFacebookPost();
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    console.log('Logged in.');
                    publishToFacebook(publishMessage);
                }
                else {
                    FB.login(function(){
                        // Note: The call will only work if you accept the permission request
                    publishToFacebook(publishMessage);
                    }, {scope: 'publish_actions'});
                }
            });
        }
    });


}
