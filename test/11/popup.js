//popup
function popup_(){
var down =false;	
var popup_={}; //the popup object
var page={};

	this.show= function (src_id,head_txt,className){
		className = className || 'popup';//popup_.id;
		var src=document.getElementById(src_id)
		window.scrollTo(0, 0);
		//dont var popup_ because it is global
		popup_ = document.createElement('div');
		popup_.className = className;
		popup_.id = 'popup_'+src_id;
		popup_.style.height=viewport().height;
		var header = document.createElement('div');
		header.className = 'popup_header';
		header.innerHTML = "<span class=\"message\">"+head_txt+"</span>";
		
		var cancel = document.createElement('div');
		cancel.className = 'popup_header_cancel';
		//cancel.innerHTML = 'close';
		var hideref = this.hide;
		cancel.onclick = function (e) {
			hideref();/*popup_.parentNode.removeChild(popup_)*/ 
			 };
		var message = document.createElement('div');
		message.className = 'popup_message';
		message.innerHTML = src.innerHTML;
		header.appendChild(cancel);
		popup_.appendChild(header);                                    
		popup_.appendChild(message);                                    
		document.body.appendChild(popup_);
		
		//popup_.classList.add("visible");
		var delay_Counter = setInterval(function(){popup_.classList.add("visible");clearInterval(delay_Counter);}, 100);
	
		this.down=true;
	}
	this.showHTML= function (body_HTML,head_txt,className){
		className = className || popup_.id;
		//var src=document.getElementById(src_id)
		window.scrollTo(0, 0);
		//dont var popup_ because it is global
		popup_ = document.createElement('div');
		popup_.className = className;
		popup_.id = 'popup_HTML';
		popup_.style.height=viewport().height;
		var header = document.createElement('div');
		header.className = 'popup_header';
		header.innerHTML = "<span class=\"message\">"+head_txt+"</span>";
		
		var cancel = document.createElement('div');
		cancel.className = 'popup_header_cancel';
		//cancel.innerHTML = 'close';
		var hideref = this.hide;
		cancel.onclick = function (e) {
			hideref();/*popup_.parentNode.removeChild(popup_)*/ 
			 };
		var message = document.createElement('div');
		message.className = 'popup_message';
		message.innerHTML = body_HTML;
		header.appendChild(cancel);
		popup_.appendChild(header);                                    
		popup_.appendChild(message);                                    
		document.body.appendChild(popup_);
		
		popup_.classList.add("visible");
		this.down=true;
	}
	this.hide=function (keepObject){
		if (popup_!= null && popup_.parentNode!= null){
		
			//popup_.style.visibility="hidden";
			popup_.classList.remove("visible");
	
           // popup_.className=popup_.id
			//popup_.style.display="none";
			//delay deleting this shit so that it does not jump top the top
			//clearInterval(page.counter);
				//page.counter = setInterval(function (e){
						//clearInterval(page.counter);
							//try not removing the popup_ tree
							if (keepObject!=true){
								// popup_.parentNode.removeChild(popup_);
								var delay_Counter = setInterval(function(){popup_.parentNode.removeChild(popup_);clearInterval(delay_Counter);}, 500);
							}
							window.scrollTo(0,page.scholl_offset);
//							page.div.style.visibility="visible";
							//page.div.style.display="block";
							//page.div.style.opacity="1";
							//page.div.style.position="relative";
							//popup_down=false;
						//}, 500);
			
			
			
		}	
		this.down=false;
	}
}