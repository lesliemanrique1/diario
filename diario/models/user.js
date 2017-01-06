// app/models/user.js
// adopted from <https://scotch.io/tutorials/easy-node-authentication-setup-and-local> 
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');
// var passportLocalMongoose = require('passport-local-mongoose');


// User Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index:true,
        unique:true,
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});



var User = module.exports = mongoose.model('User', userSchema);



module.exports.createUser = function(newUser, callback){
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}



module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

