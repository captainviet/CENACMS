Incidents = new Mongo.Collection('incidents');
Backups = new Mongo.Collection('backups');
Requests = new Mongo.Collection('requests');
HazeDatas = new Mongo.Collection('haze_datas');
DengueDatas = new Mongo.Collection('dengue_datas');

// while (Users.find().fetch().length > 0) {
//     id = Users.find().fetch()[0]._id;
//     Users.remove({
//         _id: id
//     });
// }

isLoggedIn = true;
