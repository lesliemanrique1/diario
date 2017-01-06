//js helpers (general)

var exports = module.exports={}; 

exports.slugify = function(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}; 


var remove = function(data,entries){
	var data = data.map(function(x){
		return JSON.parse(x);
	});
	//case of removing more than one entry 
	if(Array.isArray(entries)){
		
		var filter = data.filter(function(x){
			//if data not in entrie return true 
			//we are filtering the values to remove
			if(dontRemove(x["_id"],entries) == true){
				return true; 
			}

		});

		return filter; 
	}
	//case of removing a single entry
	else{
		var filter = data.filter(function(x){
			if(x["_id"]!==entries){
				return true;
			}
		}) 

		return filter;
	}

	
};

var dontRemove = function(id,entries){
	for(var i = 0; i<entries.length;i++){
		if(id == entries[i]){
			return false; 
		}
	}

	return true; 
}; 

remove.prototype.dontRemove = dontRemove; 

exports.remove = remove;