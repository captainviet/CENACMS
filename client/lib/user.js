/**
 * Created by QuangNgo on 27/3/16.
 */

if (Meteor.isClient) {

    Template.login.events({
        'click #loginBtn': function(event) {
            event.preventDefault();
            Users.insert({
                username: 'quang.sb',
                password: '123456'
            });

            var username = $('#username').val();
            var password = $('#password').val();
            console.log(username, password);
            var found = Users.find({
                username: username,
                password: password
            }).fetch();
            
            if (found.length > 0) {
                isLoggedIn = true;
                Router.go('/new-incident')
            }
            else {
                alert('Please enter correct username and password!');
            }
        }
    });

}