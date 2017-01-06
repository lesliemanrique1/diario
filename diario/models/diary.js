// models for diary 
// * Diaries are required to have a unique name 
// * Diaries are composed of entries 

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var user = new mongoose.Schema({
	username:{
		type:String,
		unique:true,
		required: true 
	}

	diaries:{
		{type:[diarySchema]}; 
	}

})

var diarySchema = new mongoose.Schema({
    name: {
        type: String,
        unique:false
    },
    entries:{type:[entrySchema]}
}); 

// * Entries are required to have a unique title 
// * Entries contain 0 or more images
// * permission must be set to public or private

var entrySchema = new mongoose.Schema({
	title:  {type:String} 
	text:{type:String}
    images: [{type:String}]; //update-> made into just a URL of strings 
    permissions: {type:String}; //set to public or private. If public can be viewed in public views 
   	date: {
        type: Date,
  		required:true
  	
    }

    // title:  {type:String, unique:true; required:[true, '{PATH} is required']}, 
    // images: {type:[entryImageSchema]}
    // permissions: {type:String, required:[true, '{PATH} is required']}, 

});
entrySchema.plugin(timestamps);






// // * Images are required to have a url

// var entryImageSchema = new mongoose.Schema({
// 	url: {type:String, required:[true, '{PATH} is required']}, 
//     // url: {type:String, required:[true, '{PATH} is required']}, 
// });



mongoose.connect('mongodb://localhost/diario');
