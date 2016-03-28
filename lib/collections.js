Incidents = new Mongo.Collection('incidents');
<<<<<<< HEAD
Backups = new Mongo.Collection('backups');
=======
Requests = new Mongo.Collection('requests');
HazeDatas = new Mongo.Collection('haze_datas');
DengueDatas = new Mongo.Collection('dengue_datas');
Users = new Mongo.Collection('users');

while (Users.find().fetch().length > 0) {
    id = Users.find().fetch()[0]._id;
    Users.remove({
        _id: id
    });
}

isLoggedIn = false;

>>>>>>> ac164cd076565bfa6178c258dfb35620e1da4322
