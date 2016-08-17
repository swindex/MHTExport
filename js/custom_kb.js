				var kb_vibrate_time=25;
				var kb_vibrate=true;
				var kb_down=false;
				
				var custom_kb_field_value="";
				var custom_kb_field_bg_color="";
				var custom_kb_field_color="";
				var custom_kb_field_selection_status=false;
				
				function customKB_Enable(){
					var articles = document.getElementsByTagName("input");
					for (var i = 0; i < articles.length; i++) {
						if (articles[i].getAttribute('type')=="text"){
							articles[i].setAttribute('readonly', 'readonly')
                            if (isTouchDevice())
							    articles[i].addEventListener('touchstart',customKB_Show,false);
                            else
                                articles[i].addEventListener('focus',customKB_Show,false);
						}
					}
				}
				function customKB_Disable(){
					var articles = document.getElementsByTagName("input");
					for (var i = 0; i < articles.length; i++) {
						if (articles[i].getAttribute('type')=="text"){
							articles[i].removeAttribute('readonly',0);
                            if (isTouchDevice())
							    articles[i].removeEventListener('touchstart',customKB_Show,false);
                            else
                                articles[i].removeEventListener('focus',customKB_Show,false);
						}
					}
					var kb=document.getElementById("keyboard");
					var kb_p=document.getElementById("keyboard_placeholder");
					var fs=document.getElementById("fswizard");
					
					if ( kb !== null){
						if ( typeof (curr_input.value) !== "undefined"){
							var r_val=curr_input.value.split("|");
							curr_input.value=r_val[0];
							
							//bring back old state
							customKB_unselect();
							//trigger onchange
							//curr_input.onchange(curr_input);
						}
						/*fs.style.bottom="0px";*/
						kb.style.display="none";
						kb_p.style.display="none";
						return false;
					}
				}
				
				
				function customKB_select(){
					// remember old values
					custom_kb_field_bg_color=curr_input.style.backgroundColor;
					custom_kb_field_color=curr_input.style.color;
					custom_kb_field_value=curr_input.value;
					custom_kb_field_selection_status=true;
					// change colors is if field is selected
					curr_input.style.backgroundColor="blue";
					curr_input.style.color="white";
				}
				function customKB_unselect(){
						//bring back old state
						curr_input.style.backgroundColor =custom_kb_field_bg_color;
						curr_input.style.color          =custom_kb_field_color  ; 
						custom_kb_field_selection_status=false;
				}

                function fireEvent(obj, evt){
                    var fireOnThis = obj;
                    if( document.createEvent ) {
                        var evObj = document.createEvent('MouseEvents');
                        evObj.initEvent( evt, true, false );
                        fireOnThis.dispatchEvent( evObj );
                    }
                    else if( document.createEventObject ) { //IE
                        var evObj = document.createEventObject();
                        fireOnThis.fireEvent( 'on' + evt, evObj );
                    }
                }
                var onchange_delay_Counter;
                var keyboard_delay_Counter;

                function customKB_Show(){
					//if some other field was active then properly close it before changing focus to a new field
					var delayed =0;
                    if (typeof (curr_input.value) !== "undefined"){
                       	var r_val=curr_input.value.split("|");
						curr_input.value=r_val[0];
						customKB_unselect();
						curr_input.onchange(curr_input);
                    }
                    	curr_input=this;
                        customKB_select();
                        if (curr_input.value=="") curr_input.value="|"; // add caret simulation !
                        keyboard_show();
                }
				function type(chr){
					if (custom_kb_field_selection_status==true)curr_input.value="";
					
					customKB_unselect()
					var r_val=curr_input.value.split("|");
					if (r_val[0]=="0" && chr !=="."){r_val[0]=r_val[0]+".";}
					curr_input.value=r_val[0]+chr.toString()+"|"
					if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
					return false;
				}
				function keyboard_bs(){
					var r_val=curr_input.value.split("|"); //remove caret
					curr_input.value=r_val[0].substring(0, r_val[0].length - 1)+"|"; //remove last char and add caret
					customKB_unselect()
					if(kb_vibrate)navigator.notification.vibrate(kb_vibrate_time);
					return false;
				}
				function keyboard_minus(){
					var r_val=curr_input.value; //remove caret
					if (r_val.substring(0, 1)=="-"){
						//Remove minus
							curr_input.value=r_val.substring(1, r_val.length); //remove minus char
						}else{
						//remove minus
							curr_input.value="-"+r_val; //add minus
						}
					//customKB_unselect()
					if(kb_vibrate)navigator.notification.vibrate(kb_vibrate_time);
					return false;
				}
				function keyboard_ok(){
					var kb=document.getElementById("keyboard");
					var kb_p=document.getElementById("keyboard_placeholder");
					var fs=document.getElementById("fswizard");
					
					if ( kb !== null){
						if ( typeof (curr_input.value) !== "undefined"){
							var r_val=curr_input.value.split("|");
							curr_input.value=r_val[0];
							
							//bring back old state
							customKB_unselect();
							//trigger onchange
							curr_input.onchange(curr_input);
						}
						/*fs.style.bottom="0px";*/
						kb.style.display="none";
						kb_p.style.display="none";
						kb_down=false;
						if(kb_vibrate)navigator.notification.vibrate(kb_vibrate_time);
					return false;
					}
				}
				function keyboard_hide(){
					var kb=document.getElementById("keyboard");
					var kb_p=document.getElementById("keyboard_placeholder");
					var fs=document.getElementById("fswizard");
					
					if ( kb !== null){
						if ( typeof (curr_input.value) !== "undefined"){
							//var r_val=curr_input.value.split("|");
							curr_input.value=custom_kb_field_value;
							
							//bring back old state
							customKB_unselect();
							//trigger onchange
							curr_input.onchange(curr_input);
						}
						/*fs.style.bottom="0px";*/
						kb.style.display="none";
						kb_p.style.display="none";
						kb_down=false;
						if(kb_vibrate)navigator.notification.vibrate(kb_vibrate_time);
					return false;
					}
				}
				function keyboard_show(){

					var kb=document.getElementById("keyboard");
					var kb_p=document.getElementById("keyboard_placeholder");
					kb.style.display="block";
					kb_p.style.display="block";
					kb_p.style.height=getOffset(kb).height+"px"; 
					kb_down=true;
					
				}
				