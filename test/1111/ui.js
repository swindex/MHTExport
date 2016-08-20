var screen_old_w=screen.width;
var screen_old_h=screen.height;
				function deg2rad(degrees) {
					return degrees * Math.PI / 180;
				}
				function rad2deg(angle){
					return angle * 180 / Math.PI;
				}
function containsAny(str, substrings) {
if (str==null)return false;
        for (var i = 0; i != substrings.length; i++) {
           var substring = substrings[i];
           if (str.indexOf(substring) != - 1) {
             return true;
           }
        }
        return false; 
    }
function containsAll(str, substrings) {
if (str==null)return false;
var k=0;
        for (var i = 0; i != substrings.length; i++) {
           var substring = substrings[i];
           if (str.indexOf(substring) != - 1) {
             k++;
           }
        }
		if (k==substrings.length)return true; else return false;
    }
function editStyleByName(name,property,value){
var parent=document.getElementById(current_parent);

	if (typeof (parrent)!= "undefined"){
		var y0=parent.getElementsByTagName('*');
	}else{
		var y0=document.getElementsByTagName('*');
	}
var a = name.split("&");

// split name


		var y0l=y0.length;
		for (j=0;j<y0l;j++)
			{
			
			if (containsAll(y0[j].getAttribute("name"),a))
				{
					y0[j].style[property]=value
				}
			}	
}
function editElementByName(name,property,value){

var parent=document.getElementById(current_parent);

	if (typeof (parrent)!= "undefined"){
		var y0=parent.getElementsByTagName('*');
	}else{
		var y0=document.getElementsByTagName('*');
	}
	var y0l=y0.length;
	for (j=0;j<y0l;j++)
		{
		try{
			if (y0[j].getAttribute("name")==name)
				{
					if (value != y0[j][property])y0[j][property]=value;
				}
			}catch(err){}
		}	
}
function editElementById(id,property,value){
	try{
		document.getElementById(id)[property]=value;
		}catch(e){alert(e);}

}
function editStyleById(id,property,value){

document.getElementById(id).style[property]=value;

}
function round(num,decimals){
    var sign = num >= 0 ? 1 : -1;
    return (Math.round((num*Math.pow(10,decimals))+(sign*0.001))/Math.pow(10,decimals)).toFixed(decimals);
}
function isOdd(num) { return num % 2;}

function X_Y_Delta(Dia1,Dia2,Cl1,Cl2,Dia){
cl=(Dia-Dia1)*(Cl2-Cl1)/(Dia2-Dia1)+parseFloat(Cl1);
if (Dia==Dia1) return Cl1;
if (Dia==Dia2) return Cl2;

return cl;
}
//headers_name_title_style = array{}
function draw_Table(target_id,dTable,headers_name_title_style,selected_row,firstrow_is_header){

	var c,r,t
	t = document.createElement('table');
	t.border=0;
	t.cellSpacing=1;
	t.className="reference_table_body";
	var n=0;
	var i=0;
	var ii=0;
	var columns =[];
	if (typeof headers_name_title_style !="undefined"){
		r = t.insertRow(0);
		r.className="header"
		for (var header in headers_name_title_style){
			if (headers_name_title_style[header] instanceof Array){
			//if header element is an array then we have a pair of key/text/maybe style
			//only output Text 
				c=r.insertCell(n);
				//add name to the columns array
				columns[n]=headers_name_title_style[header][0];
				//add title to header row
				c.innerHTML=headers_name_title_style[header][1];
				//add style to cell
				if (typeof headers_name_title_style[header][2] !="undefined"){
					c.style=headers_name_title_style[header][2];
				}
				n++;
				
			}else{
			//if it is not an array then simply put that text into the heder row
				c=r.insertCell(n);
				c.innerHTML=headers_name_title_style[header];
				n++;
			}
		}
		i=1;
	}else{
            //Okay we do not have any headers, so we create a header array with unique values
            r = t.insertRow(0);
            r.className="header"
            for (var row in dTable){
                for (var column in dTable[row]){
                    if (!inArray(column,columns)){
                        columns[ii]=column;
                        c=r.insertCell(ii);
                        if (firstrow_is_header != true){
                            c.innerHTML=column;

                        }else{

                            c.innerHTML=dTable[0][columns[ii]];
                        }
                        ii++;
                    }
                }
                break;
            }
            i=1;
	}
	ii=0;
    var n=0;
	for (var row in dTable){
        if (firstrow_is_header == true && n==0){
            //nothing just skip first row


        }else{
            r = t.insertRow(i);
            if (isOdd(i))r.className="odd";
            if (selected_row==i)r.className="selected";
            for (var column in columns){
                c=r.insertCell(ii);
                if (typeof dTable[row][columns[column]]!= "undefined"){
                    c.innerHTML=dTable[row][columns[column]];
                }else{
                    c.innerHTML="";
                }

                ii++;
            }
            ii=0;
            i++;
        }
        n++;
	}
	document.getElementById(target_id).innerHTML="";
	document.getElementById(target_id).appendChild(t);

}
var is_IE_=undefined;
function is_IE(){
if (is_IE_==undefined){
    if(window.ActiveXObject || "ActiveXObject" in window){
        // Always true if browser is Internet Explorer
        return true;
    }
    return false;
}else{
    return is_IE_;
}
}
	function removeOptions(selectbox)
		{
			var i;
			for(i=selectbox.options.length-1;i>=0;i--)
			{
				selectbox.remove(i);
			}
		}

			function Get_Value(id){
				try{
					return document.getElementById(id).value;
				}catch(e){alert(e+" "+ id);}
			}
			function Set_Value(id,val){
				try{
					document.getElementById(id).value=val;
				}catch(e){alert(e +" "+ id);}
			}
			function on_resize(){
				// window.orientation + " " + screen.width);
				/*alert("screen")
				document.getElementById("body").style.fontSize=global_font-1+"em";
				document.getElementById("body").style.fontSize=global_font+"em";
			*/
			//update screen so it recalculates widths of elements
			//Very important check if screen width changes otherwise do nothing
			if (screen.width != screen_old_w && screen_old_h!=screen.height){
				document.getElementById("div_body").style.display="none";
				window.setTimeout(function(){document.getElementById("div_body").style.display="block";},1);
			}
			screen_old_w=screen.width;
			screen_old_h=screen.height;

			}
			function getStyle(x, styleProp) {
				if (x.currentStyle) var y = x.currentStyle[styleProp];
				else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
				return y;
			}

			function reset_backgrounds(){
			var art = document.getElementsByTagName("*");
					for (var i = 0; i < art.length; i++) {
						/*if (getStyle(art[i],"background") != "none"){
							art[i].style.backgroundImage=getStyle(art[i],"background");
						}*/
						if (getStyle(art[i],"background-image") != "none"){
							art[i].style.backgroundImage=getStyle(art[i],"background-image");
						}
					}
			}
			
			function hasOverflowScrolling() {
				var prefixes = ['webkit', 'moz', 'o', 'ms'];
				var div = document.createElement('div');
				var body = document.getElementsByTagName('body')[0];
				var hasIt = false;

				body.appendChild(div);

				for (var i = 0; i < prefixes.length; i++) {
					var prefix = prefixes[i];
					div.style[prefix + 'OverflowScrolling'] = 'touch';
				}

				// And the non-prefixed property
				div.style.overflowScrolling = 'touch';

				// Now check the properties
				var computedStyle = window.getComputedStyle(div);

				// First non-prefixed
				hasIt = !!computedStyle.overflowScrolling;

				// Now prefixed...
				for (var i = 0; i < prefixes.length; i++) {
					var prefix = prefixes[i];
					if (!!computedStyle[prefix + 'OverflowScrolling']) {
						hasIt = true;
						break;
					}
				}

				// Cleanup old div elements
				div.parentNode.removeChild(div);

				return hasIt;
			}
			function fs_wizard_load_state(){
				try{
					var getStstus="";
					var ret=10;
					//UI_Native_KB
					getStstus = window.localStorage.getItem('UI_Native_KB');
						if (getStstus == "true") {
							document.getElementById("UI_Native_KB").setAttribute('checked','checked');
							customKB_Disable();
						 }else {
							customKB_Enable();
							
						}
					//UI_Vibrate_KB
					getStstus = window.localStorage.getItem('UI_Vibrate_KB');
						if (getStstus == "true") {
							document.getElementById("UI_Vibrate_KB").setAttribute('checked','checked');
							kb_vibrate=true;
						 }else {
							kb_vibrate=false;
						}					//Font Size
					ret = window.localStorage.getItem('UI_Font_Size');
					
						if (ret>=6 && ret<=13) {
							document.getElementById("font_size").value=ret;
						}else{
							 document.getElementById("font_size").value=10;
							 ret=10;
						}	
						ret=ret/12;
						document.getElementById("body").style.fontSize=ret+"em";
						
						}catch(e){}
			
			}


				function fs_wizard_save_state(){
				//save the whole tpl thing
				try{
				localStorage.setItem('FSWizard_last_state', JSON.stringify(tpl));
				//save version number
				window.localStorage.setItem('FSWizard_version', version);
					//use native keyboard
					if(document.getElementById("UI_Native_KB").checked) {
						window.localStorage.setItem('UI_Native_KB', "true");
					} else {
						window.localStorage.setItem('UI_Native_KB', "false");
					}
					//virtual KB Vibrate
					if(document.getElementById("UI_Vibrate_KB").checked) {
						window.localStorage.setItem('UI_Vibrate_KB', "true");
					} else {
						window.localStorage.setItem('UI_Vibrate_KB', "false");
					}
					//Font size
					window.localStorage.setItem('UI_Font_Size', document.getElementById("font_size").value);
					
					//var err = Error.create("ftw", "errinfo");
					}catch(e){return}
					fs_wizard_load_state();
				}

				//alter standard onclick event
				function fractions_Enable(){
					var art = document.getElementsByTagName("*");
					var dec = Array();
					var split=Array();
					for (var i = 0; i < art.length; i++) {
						if (art[i].getAttribute('class')=="fraction"){
							dec = art[i].innerHTML.split("-")
							if (dec.length==1){
								split = dec[0].split("/")
								if( split.length == 2 ){
									art[i].innerHTML=('<span class="frac"><span class="fraction_top">'+split[0]+'</span><span class="fraction_bottom">'+split[1]+'</span></span>')
								}    
							}
							if (dec.length==2){
								split = dec[1].split("/")
								if( split.length == 2 ){
									art[i].innerHTML=('<span class="middle">'+dec[0]+'</span><span class="frac"><span class="fraction_top">'+split[0]+'</span><span class="fraction_bottom">'+split[1]+'</span></span>')
								}    
							}	
						}
					}
				}

                function ascii (a) { return a.charCodeAt(0); }

				function getOffset( el ) {
					var _x = 0;
					var _y = 0;
					var _w=el.offsetWidth;
					var _h=el.offsetHeight;
					
					while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
						_x += el.offsetLeft - el.scrollLeft;
						_y += el.offsetTop - el.scrollTop;
						el = el.offsetParent;
					}
					return { top: _y, left: _x,height: _h,width:_w };
				}
				function viewport() {
					var e = window, a = 'inner';
					if (!('innerWidth' in window )) {
						a = 'client';
						e = document.documentElement || document.body;
					}
					return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
				}

			function reset_default_fields(){
			//reset yellow elements for they are defuault
				var y=document.getElementsByTagName('input');
				for (j=0;j<y.length;j++)
					{
					if (typeof y[j].name !== "undefined" && typeof self !=="undefined"){
					//if (y[j].style.backgroundColor=="yellow" && !y[j].readOnly && y[j].name!=self.name)// && y[j].name!=self.name)
					     if (y[j].style.backgroundColor=="yellow" && y[j].name!=self.name)// && y[j].name!=self.name)
						{
						y[j].style.backgroundColor=""
							if (!y[j].type){
								y[j].innerHTML ="";
							}else{
								y[j].value ="";
							}
						}
					}
					}
			}
			function elem_onchange(self,direct_load){
					//tell server to output only xml result
					
					
					if (typeof self !=="undefined"){
					self.style.backgroundColor="";
					}

					//document.fswizardform.ajax.value=1;
						if (document.fswizardform.ballnose){
							if (document.fswizardform.ballnose.checked==true ){
								document.fswizardform.tool_corner_rad.value=document.fswizardform.tool_diameter.value/2;
								//document.fswizardform.tool_corner_rad.readOnly=true;
								//document.fswizardform.tool_corner_rad.style.backgroundColor="auto";
							}else{
								//document.fswizardform.tool_corner_rad.readOnly=false;
							}
						}
						if (document.fswizardform.slot){
							if (document.fswizardform.slot.checked==true ){
								document.fswizardform.tool_woc.value=document.fswizardform.tool_diameter.value;
								document.fswizardform.tool_woc.style.backgroundColor="";
								//document.fswizardform.tool_woc.readOnly=true;
							}else{
								//document.fswizardform.tool_woc.readOnly=false;
							}
						}
						
						
						
						//reset yellow elements for they are defuault
						reset_default_fields();
						//clll ajax parser
						
						//xmlhttpPost('{form_action}','fswizardform','ajax_animation','<img src="bimg/ajax-loader.gif" width="20px" height="20px" />')
						calc_fswizard(self,direct_load);
									//AFTER updating main window, update myCut DB window
						
					return true;
				}
			//function fliter_ischeck(){
			
			//}
			function filter_onchange(self){
				//tell server to output only xml result
				//document.fswizardform.ajax.value=2;
				httpPost('{form_action}','fswizardform','calc_log','')
			}
				

//TABS
var current_tab= new Object();
current_tab.id ={};
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
		function tab_activate(){
			var t=document.getElementById(this.id);
			var tc=document.getElementById(this.id+'_content');
			var parent=this.parentElement;
			try{
			var parent_id= this.getAttribute("parent_id");
				if (parent_id != null){
					parent=document.getElementById(parent_id);
				}
			}catch(e){}
			if (t.id !== current_tab.id || tc.style.display=='none'){
				tabs_hide_all(parent);
				if (t && tc){
					if(tc.className=='tabs_content whole_screen'){	
						popUp(this.id+'_content')
					}else{
						t.className='tab_button_active';
						tc.style.display='block';
						current_tab=t;
					}
				}
				}else{
					tabs_hide_all(parent);
				}
				
			}
		function tab_activate_by_id(id){
			var t=document.getElementById(id);
			var tc=document.getElementById(id+'_content');
			var parent=t.parentElement;
			
			try{
			var parent_id= this.getAttribute("parent_id");
				if (parent_id != null){
					parent=document.getElementById(parent_id);
				}
			}catch(e){}
			if (t.id !== current_tab.id || tc.style.display=='none'){
				tabs_hide_all(parent);
				if (t && tc){
					t.className='tab_button_active';
					tc.style.display='block';
					current_tab=t;
				}
			}else{
				tabs_hide_all(parent);
			}
		}
		function tabs_hide_all(parent){
			/*if (parent != null){
				var all = parent.getElementsByTagName('*');
			}else{
				var all = document.getElementsByTagName('*');
			}*/
			var all = document.getElementsByTagName('*');
			
			for(var n=0;n<all.length;n++){
			
				try{
					if(all[n].getAttribute("parent_id")==parent.id || all[n].parentElement.id==parent.id){
						if(all[n].className=='tabs_content'){
							all[n].style.display='none';
						}
						if(all[n].className=='tabs_content whole_screen'){
							all[n].style.display='none';
						}
						if(all[n].className=='tab_button_active'){
							all[n].className='tab_button';
						}
					}
				}catch(e){}
			}
		}
		function tabs_init(active){
			var all = document.getElementsByTagName('*');
			/*if (isTouchDevice()){
				for(var n=0;n<all.length;n++){

							if(all[n].className=='tab_button'){
							all[n].ontouchstart=tab_activate;
							}
							if(all[n].className=='tab_button_active'){
							all[n].ontouchstart=tab_activate;
							}
				}
			}else{*/
				for(var n=0;n<all.length;n++){

							if(all[n].className=='tab_button'){
							all[n].onclick=tab_activate;
							}
							if(all[n].className=='tab_button_active'){
							all[n].onclick=tab_activate;
							}
				}
			//}
			tab_activate_by_id(active);
		}		
		
		function setPopupSize(id){
			//var all = document.getElementsByTagName('div');
			//for(var n=0;n<all.length;n++){
			var pop= document.getElementById(id);
						if(pop.className=='popup'){
							pop.style.position="absolute";
							//all[n].style.display="none";
							pop.style.top="0px";
							pop.style.left="0px";
							
							pop.style.width=viewport().width+"px";
							pop.style.height=viewport().height+"px";
						
						}
						
			//}
		
		
		}
		
		
//##		Code to enable scrolling on dumb old droids
		function isTouchDevice(){
			try{
				document.createEvent("TouchEvent");
				return true;
			}catch(e){
				return false;
			}
		}
		function touchScroll(id){
			if(isTouchDevice()){ //if touch events exist...
				var el=document.getElementById(id);
				var scrollStartPos=0;
				 
				document.getElementById(id).addEventListener("touchstart", function(event) {
					scrollStartPos=this.scrollTop+event.touches[0].pageY;
					//event.preventDefault();
					},false);
				document.getElementById(id).addEventListener("touchmove", function(event) {
					this.scrollTop=scrollStartPos-event.touches[0].pageY;
					//alert("touchmove")
					event.preventDefault();
					},false);
				/*document.getElementById(id).addEventListener("touchend", function(event) {
					this.scrollTop=scrollStartPos-event.touches[0].pageY;
					//alert("touchmove")
					//event.preventDefault();
					},false);*/
			}
		}
		//enable scrolls for all divs on the page!
			function scrolls_Enable(){
					var art = document.getElementsByTagName("div");
					for (var i = 0; i < art.length; i++) {
						try{
							if (art[i].id){
								touchScroll(art[i].id);
							}
						}catch(e){
						
						}
					}
				}
			function Slider_Enable(slider_id,input_id){
				var slider=document.getElementById(slider_id);
				var input=document.getElementById(input_id);
				
				if(isTouchDevice()){ //if touch events exist...
				var el=document.getElementById(id);
				var scrollStartPos=0;
				 
				/*document.getElementById(id).addEventListener("touchstart", function(event) {
					input.value=event.touches[0].X;
					//event.preventDefault();
					},false);*/
				document.getElementById(id).addEventListener("touchmove", function(event) {
					input.value=event.touches[0].X;
					
					//alert("touchmove")
					event.preventDefault();
					},false);
				/*document.getElementById(id).addEventListener("touchend", function(event) {
					this.scrollTop=scrollStartPos-event.touches[0].pageY;
					//alert("touchmove")
					//event.preventDefault();
					},false);*/
			}
		
			
			}
