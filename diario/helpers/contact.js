var exports = module.exports={}; 
	exports.messageBody = function(message){
		message=message.replace(/\r?\n/g, '<br />');
		
		return message; 

	}
