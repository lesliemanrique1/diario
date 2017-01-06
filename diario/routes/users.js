var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var User = require('../models/user');
var helpers = require('../helpers/helpers.js');

var UserDB = mongoose.model('userDB'); 
var DiarySchema = mongoose.model('diarySchema');
var EntrySchema = mongoose.model('entrySchema');



// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty(); 
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    var errors = req.validationErrors();
	if(errors){
		console.log("errors: ", errors);
		res.render('register',{
			errors:errors
		});

	} 
	else {

		User.findOne({username:username},function(err,user){
			if(user)
			{
				errors = []; 
				errors.push({param: "username", msg: "Username is already registered", value: username}); 
				console.log(errors);
				res.render('register',{errors:errors});
				return;
			}

			else{

				var newUser = new User({
				name: name,
				email:email,
				username: username,
				password: password
				});

		

				var userDb = new UserDB({
					username:newUser.username
				}); 

				slug = helpers.slugify("Diary1");
				var diarySchema = new DiarySchema({
					diary_name: "Diary1",
					slug:slug

				}); 

				
				userDb.diaries.push(diarySchema); 

			
				userDb.save(function(err,post,count){
					if(err){
						console.log(err);
					}
					else{
						User.createUser(newUser, function(err, user){
							if(err) {
								throw err;
							}

						}); 


						req.flash('success_msg', 'You are registered and can now login');
						res.redirect('/users/login');


					}
				});

				
				
				
			}
		});


		
	}
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You have logged out. Goodbye!');

	res.redirect('/users/login');
});


// Passport stuff ...
passport.use(new LocalStrategy(
  function(username, password, done) {		
   
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}



   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});

   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


module.exports = router;