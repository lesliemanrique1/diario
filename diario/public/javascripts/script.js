document.addEventListener("DOMContentLoaded",function(){
	//create page 
	var selectDiaryLink=document.getElementById("addDiary");
	selectDiaryLink.addEventListener('click',function(){
		//hide parent div 
		document.getElementById("selectDiary").style.display = "none";
		var create = document.getElementById("createNewDiary");
		create.style.display = create.style.display === 'none' ? '' : 'none';
		

	}); 



});

