var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
require('../db');
var mongoose = require('mongoose');
var UserDB = mongoose.model('userDB'); 
var DiarySchema = mongoose.model('diarySchema');
var EntrySchema = mongoose.model('entrySchema');
var sorter = require('../helpers/sorter.js'); 
var helpers = require('../helpers/helpers.js'); 
var contactHelper = require('../helpers/contact.js'); 
//require('functions');
// var EntryImageSchema = mongoose.model('entryImageSchema');

// Get Homepage
// TODO: 
// Change this so it displays the most recent posts from all diaries 

router.get('/', ensureAuthenticated, function(req, res){

	var diary="Diary1"; 



	UserDB.findOne({username:req.user.username},function(err,data,count){
		//var condition = true; 
		var ents = []; 
	

		var diaryNames  = data.diaries.map(function(x){
			//get all the names
			var obj = {diary_name:x.diary_name,slug:x.slug}

			return obj;
		});



		for(var i =0;i<data.diaries.length;i++){
			
			//for every entry in each diary 
			for(var j =0; j<data.diaries[i].entries.length;j++){
				//find all the entries and add it to n 
				var object = {"diary_name":data.diaries[i].diary_name,"entry":data.diaries[i].entries[j]}; 

				ents.push(object); 
			}

		}

		
		var sortedEntries = sorter.sortEntries(ents);



		//render entries and render diary list 
		res.render('index',{"username":req.user.username,"entry":sortedEntries,"diaryNames":diaryNames}); 

		


	}); 
	

	
});
// show selected diary!!!! 
router.get('/diary-posts/:slug',function(req,res){
	var slug = req.params.slug;
	//filter function -> search through all the diaries and find the right one 
	UserDB.findOne({username:req.user.username},function(err,data,count){
		var found = data.diaries.filter(function(x){
			return x.slug===slug;


		});
		var diaryName = found[0].diary_name;
		var entries=found[0];

		entries=entries.entries; 
		entries=entries.map(function(x){
			return JSON.parse(x);
		});

		

		res.render('diaries',{"diaryname":found[0].diary_name,"post":entries});
		//res.send(entries[0]["entries"]);
	});


}); 
//when user clicks on delete
router.post('/diary-posts/:slug',function(req,res){
	var val = req.body.edit;
	var slug = req.params.slug;

	UserDB.findOne({username:req.user.username},function(err,data,count){
		var index = -1; 
		var cont = true; 
		

		var found = [];
		for(var i = 0; i<data.diaries.length;i++){
			if(cont === true){
				index++;
			}
			if(data.diaries[i].slug === slug){
				found.push(data.diaries[i])
				cont=false;
			}
		}
	


		var filteredEntries = helpers.remove(found[0].entries,val);  //error
		 
		//replace data with filtered entries
		filteredEntries = filteredEntries.map(function(x){
			return(JSON.stringify(x));
		});
		data.diaries[index].entries=filteredEntries;


		//save the data
		data.markModified('diaries');
		data.markModified('entries');
		data.save(function(saveErr, saveData, saveCount) {
			if(saveErr){
				console.log(saveErr,"Error with saving data");
			}
			console.log(saveData);	
		});

	 	res.redirect('/');


	 });




}); 

router.get('/home',function(req,res){
	res.render('home'); 
});

router.get('/contact', function(req, res){

	res.render('contact');
});


//Use AJAX to make this better 
router.post('/contact',function(req,res){
	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });

    //var text = 'Hello world from \n\n' + req.body.name;


	var messageBody = contactHelper.messageBody(req.body.messageBody);

    var mailOptions = {
	    from: req.body.email, // sender address
	    to: 'ljm39100@gmail.com', // list of receivers
	    subject: 'Contact Us Message', // Subject line
	    //text: text //, // plaintext body
	    html: '<p><strong>Message From:&nbsp;&nbsp;</strong>' + req.body.name + '</p>'+
	    		'<p><strong>Email Address:&nbsp;&nbsp;</strong>' + req.body.emailAddress +'</p>'+
	    		'<p><strong>Message:</strong></br>' + messageBody + '</p>' // You can choose to send an HTML body instead
	

	};

	transporter.sendMail(mailOptions, function(error, info){
		console.log("sending...")
	    if(error)
	    {
	        console.log(error);
	       	res.render('contact',{error:"error"});

	    }
	    else{
	        res.render('contact',{message:"sent"}); 

	    }
	 });

	//send a response has been sent message 
	
});

router.get('/create',ensureAuthenticated,function(req,res){
	//display diary names
	var user = req.user.username;
	UserDB.findOne({username:user},function(err,data,count){
		var d = data.diaries; 
		console.log("display diaries....\n");
		for(var i =0; i<data.diaries.length;i++){
			console.log(data.diaries[i]);

		}

		res.render('create',{diary:d});
	});
	

});

router.post('/create', ensureAuthenticated,function(req, res){
	//validation of create form!!!
	var title = req.body.title;
	var entry = req.body.entry;
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('entry', 'Entry is required').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		console.log("\n\n\nerrors: ", errors);
		var user = req.user.username;
		UserDB.findOne({username:user},function(err,data,count){
			var d = data.diaries; 
			console.log("display diaries....\n");
			for(var i =0; i<data.diaries.length;i++){
				console.log(data.diaries[i]);

			}
			res.render('create',{errors:errors,diary:d});
		});

	} 
	
	else{
		var diaryChosen = req.body.diaryname;
		var diaryNew = req.body.newdiaryname; 

		var user = req.user.username;
		console.log(req.user.username);
		console.log(req.body.title);
		console.log(req.body.entry);
		var today = new Date();
		console.log(today);

		// var title = req.body.title;
		// var entry = req.body.entry;

		//parse urls into a list
		var images = [req.body.url1,req.body.url2,req.body.url3]

		//validation

		console.log(errors);


		// var entryText = req.body.entry.replace(/\r?\n/g, '<br />');
		var entry  = new EntrySchema({
			title:req.body.title,
			text:req.body.entry,
			date:today,
			images:images
			

		}); 




			UserDB.findOne({username:user},function(err,data,count){

				if(diaryNew){
					diaryChosen = diaryNew;
					slug = helpers.slugify(diaryChosen);
					//create a slug of diary 
					var diarySchema = new DiarySchema({
						diary_name: diaryNew,
						slug:slug
					});
					data.diaries.push(diarySchema); 
					
					
				}

				//push new diary 

				

				//console.log("ENTRIES\T",data.diaries[0]["entries"]);
				for(var i =0; i<data.diaries.length;i++){
					if(data.diaries[i].diary_name === diaryChosen){

						data.diaries[i].entries.push(JSON.stringify(entry));
						
					}
				}
				data.markModified('diaries');
				data.markModified('entries');
				data.save(function(saveErr, saveData, saveCount) {
					if(saveErr){
						console.log(saveErr,"Error with saving data");
					}
					console.log(saveData);	
				});
				
				res.redirect('/');

				

			});
	}


	
});



router.get('/style',function(req,res){
	res.render('public/stylesheets/style.css');
});




// callback function to make sure user is authenticated 
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	else {
		// req.flash('error_msg','Please log in!');
		// res.redirect('/users/login');
		res.redirect('/home');

	}
}

module.exports = router;