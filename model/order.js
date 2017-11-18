// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({
    placeName:String,
    userEmail:String,
    orderTime:String,
    outTime:String,
    gender:String,
    dress:String,
    color:String,
    number:String,
    status:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('order', orderSchema);
