Incidents = new Mongo.Collection('incidents');
Backups = new Mongo.Collection('backups');
Requests = new Mongo.Collection('requests');
HazeDatas = new Mongo.Collection('hazeDatas');
DengueDatas = new Mongo.Collection('dengueDatas');

// while (Users.find().fetch().length > 0) {
//     id = Users.find().fetch()[0]._id;
//     Users.remove({
//         _id: id
//     });
// };
