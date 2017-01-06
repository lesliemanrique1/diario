var exports = module.exports={}; 
exports.sortEntries = function(entryList){
	var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
	};
	var entries = []; 
	//for some reason, i couldn't make the entries parsable
	//i have to have the following as an extra step 
	entries = entryList.map(function(x){
		x.entry = JSON.parse(x.entry);
		x.entry.formatDate = new Date(x.entry.date).toLocaleTimeString("en-us", options);
		return x; 


	});
	// entryList.forEach(function(x){
	// 	x.entry = JSON.parse(x.entry);
	// 	x.entry.formatDate = new Date(x.entry.date).toLocaleTimeString("en-us", options);
	// 	entries.push(x);

	// });
	//sort latest to earliest 
	entries.sort(function(a,b){
		var dateA=new Date(a.entry.date);
		var dateB=new Date(b.entry.date);
		return dateB-dateA;


	});
	return entries; 


}


