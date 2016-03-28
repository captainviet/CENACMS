/**
 * Created by QuangNgo on 22/3/16.
 */

var pageId = '1675747249379266';    // facebook page id
var pageAccessToken; // access token for Facebook page

/**
 * Twitter app constants
 */
var T_consumer_key = 'QiqUFJ5YJHEJoVxNxb1TerbZn';
var T_consumer_secret = 'qYm31q3zPqey5Ok12Z4PkWjhesnUR8UOoXNKbT6UiTvecfcrjF';
var T_access_token = '712817952941170688-PYuSdJI2NDC3y5kHrM8kZMuiwwZdP32';
var T_access_token_secret = '5IsqmZzrLXpgHPIek0wKIjO9SHvDuRp03sbxaAxODVWqG';

if (Meteor.isClient) {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1046795818712640',
            xfbml      : true,
            version    : 'v2.5'
        });
    };

    Template.social.events({

        /**
         * Click publish event
         */

        'click #publishBtn': function (event) {
            event.preventDefault();
            var fbChecked = $('#facebookCheckBox').is(':checked');
            var twChecked = $('#twitterCheckBox').is(':checked');
            if (fbChecked) {
                publishToFacebook();
            }
            if (twChecked) {
                publishToTwitter();
            }
        },

        /**
         * Click preview event
         */

        'click #previewBtn': function (event) {
            event.preventDefault();
            var publishMsg = generatePost();
            alert('Post content: \n' + publishMsg);
        }
    });

}

function generatePost() {
    var type = $('#incident').val();
    var content = $('#content').val();
    return 'Incident type ' + type + ' happened!\n' + 'Details: ' + content;
}

function postToPage(publishMessage) {
    FB.api('/me/accounts/', function(response) {
        for (var i = 0; i<response.data.length; i++) {
            if (response.data[i].id === pageId) {
                pageAccessToken = response.data[i].access_token;
                break;
            }
        }
        console.log(pageAccessToken);
        FB.api('/me/feed/', 'POST', {
            access_token: pageAccessToken,
            message: publishMessage
        }, function(response) {
            console.log(response);
        })
    });
}

function publishToFacebook() {
    var publishMessage = generatePost();
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log('Logged in.');
            postToPage(publishMessage);
        }
        else {
            FB.login(function(){
                // Note: The call will only work if you accept the permission request
                postToPage(publishMessage);
            }, {scope: 'publish_actions'});
        }
    });
}

function publishToTwitter() {
    var publishMessage = generatePost();
    var twtLink = 'http://twitter.com/home?status=' +encodeURIComponent(publishMessage);
    window.open(twtLink,'_blank');

}