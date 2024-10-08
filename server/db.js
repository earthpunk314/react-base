const mongoose = require('mongoose');
const url = process.env.MONGODB;

mongoose.set('strictQuery', true);
mongoose.connect(url);

const userSchema = new mongoose.Schema({
  uid:       String, // from firebase auth
  username:  String,

  createdOn: {type: Date, default: Date.now},

  email:     String,
  phone:     String,

  settings:  Object,

  notifications: [Object],
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  friendsPending: [String],
  unread: {type: Number, default: 0},
  messages: Object
}, {minimize: false});

const messageSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  sentTo: String,
  media: [],

  createdOn: {type: Date, default: Date.now}
});

const User = new mongoose.model('User', userSchema);
const Message = new mongoose.model('Message', messageSchema);

var models = {
  User: User,
  Message: Message
};

module.exports = models;