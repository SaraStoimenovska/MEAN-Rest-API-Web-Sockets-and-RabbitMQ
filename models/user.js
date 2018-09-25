var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name : String,
    password : String,
    profession : String,
    status :{ type: String, default: "available"}
});

module.exports = mongoose.model('User', userSchema);