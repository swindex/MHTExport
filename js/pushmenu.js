//pushmenu
var visible_panel_id="";
var pushmenu_down=false;
function pushmenu_move_page(pos){
	var p = document.getElementById("page");
	var new_w=getOffset(p).width
	p.style.width=new_w+"px";
	p.style.marginLeft=pos+"px";
	//shift all fixed elements as well
	var art = p.getElementsByTagName("div");
		for (var i = 0; i < art.length; i++) {
			if (document.defaultView.getComputedStyle(art[i], null).position=="fixed"){
				art[i].style.left=pos +"px";	
			}
		}

}
function pushmenu_show(){
var p = document.getElementById("page");
var m = document.getElementById("pushmenu");


//pushmenu_move_page("300")

m.style.display="block";
m.style.opacity="1";
p.style.display="none";
pushmenu_down=true;
}
function pushmenu_hide(){
var p = document.getElementById("page");
var m = document.getElementById("pushmenu");
	if (m.style.display!=="none"){
		m.style.opacity="0";
		clearInterval(intervalCounter);
		intervalCounter = setInterval(function (e){
						clearInterval(intervalCounter);
						if (m!= null){
							m.style.display="none";
							p.style.display="block";
							pushmenu_down=false;
						}
					}, 500);
		//pushmenu_move_page("0")
		//p.style.width="100%";
	}

}
function pushmenu_toggle(){
var m = document.getElementById("pushmenu");
if( m.style.display=="block" ){
	pushmenu_hide();
}else{
	pushmenu_show();
}
return false;
}
function pushmenu_show_panel(panel_id){
cp=document.getElementById(visible_panel_id);
p=document.getElementById(panel_id);
if (cp!==null){
	if (typeof(cp.style)!== "undefined") {cp.style.display="none";}
}
if (p!==null){
	if (typeof(p.style)!== "undefined") {p.style.display="block";}
	}
visible_panel_id=panel_id;
pushmenu_hide();
}
