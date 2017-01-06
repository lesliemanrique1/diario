var mongoose = require('mongoose');
// var URLSlugs = require("mongoose-url-slugs");  



var userDB = new mongoose.Schema({
	username:{
		type:String,
		unique:true,
		required: true 
	},

	diaries:{
		type:[diarySchema]
	}
});

var diarySchema = new mongoose.Schema({
	diary_name: {type:String, required:[true, '{PATH} is required']}, 
	slug: {type:String}, 
    entries:{type:[entrySchema]}
});

// diarySchema.plugin(URLSlugs('diary_name'));

// * Entries are required to have a unique title 
// * Entries contain 0 or more images
// * permission must be set to public or private
var entrySchema = new mongoose.Schema({
	title:  {type:String},
	text:{type:String},
    images: [{type:String}], //update-> made into just a URL of strings 
    permissions: {type:String},
   //set to public or private. If public can be viewed in public views 
   	date: {
        type: Date,
  		required:true
  	}
});




// * Images are required to have a url



mongoose.model('userDB', userDB);
mongoose.model('diarySchema', diarySchema);
mongoose.model('entrySchema', entrySchema);




// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/diariodb';
}
// mongoose.connect('mongodb://localhost/diariodb');
mongoose.connect(dbconf);
