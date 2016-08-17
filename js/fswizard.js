//This file is the property of Eldar Gerfanov
//Copiright is exculsively owned by Eldar Gerfanov
//No decompilation or reverse-engineering is permitted
//You should not see this text
//If you are smart enough to get your hands on this code, i hope you are smart enough to not release it to the public
//As you can see a lot of work went into this and i hope you can respect it.
// FSWizard Logic
	var version="1.31";
	var calc_run=true;
	var current_parent="";
  	
	var db_text_pro=""
    var db_text_lite=""
	
	
	var db_text="";
	var db = new Object(); //create database object
	var tpl = new Object(); // create object that holds all of the calc info
	
	//initialize some other shit here
	var curr_input =new Object(); //create an object for holding input
	tpl["form_post"]={}
		tpl["form_post"]["current_input_units"]={}
		tpl["form_post"]["current_output_units"]={}

		tpl["form_post"]["current_input_units"]="in"
		tpl["form_post"]["current_output_units"]="in"

	tpl["result"]={}
		tpl['result']['units_sfm']={}
		tpl['result']['units_vol']={}
		tpl['result']['units_torque']={}
		tpl['result']['units_force']={}
		tpl['result']['units']={}
		tpl['result']['chip_radial_real_thinning_factor']={}
		tpl['result']['tool_effective_diameter']={}
		tpl['result']['chip_axial_real_thinning_factor']={}
		tpl['result']['chip_real_thinning_factor']={}
	tpl["form_error"]={}
		tpl['form_error']['thread_major_diameter']={}
//declare triangle shit
	tpl['triangle']={}
		tpl['triangle']['angle']={}
		tpl['triangle']['angle']['a']={}
		tpl['triangle']['angle']['b']={}
		tpl['triangle']['angle']['c']={}

		tpl['triangle']['side']={}
		tpl['triangle']['side']['ab']={}
		tpl['triangle']['side']['bc']={}
		tpl['triangle']['side']['ca']={}
		
	function load_table (text,table_name,where_field,where_value){
		var parser=new DOMParser();
		var xml = parser.parseFromString(text,'text/xml');
		var table = [];
		var rows = xml.getElementsByTagName(table_name);
		for (i=0;i<rows.length;i++){
			var nodes = rows[i].childNodes;
			if (nodes.length>1){
				if (where_field !="" && where_value!="" && typeof where_field !="undefined" && typeof where_value != "undefined"){
					try{
						if (inArray(where_value,nodes,"textContent")){
							//copy all fields into our array
							table[rows[i].childNodes[0].textContent]={}
							for (ii=0;ii<nodes.length;ii++){  
								 table[rows[i].childNodes[0].textContent][rows[i].childNodes[ii].nodeName]=rows[i].childNodes[ii].textContent;
							}
						}
					}catch(err){}
				}else{
					//copy all fields into our array
					table[rows[i].childNodes[0].textContent]={}
					for (ii=0;ii<nodes.length;ii++){  
						 table[rows[i].childNodes[0].textContent][rows[i].childNodes[ii].nodeName]=rows[i].childNodes[ii].textContent;
					}
				}
			}
		}
		return table;
	} 
	
	function inArray(needle, haystack, haystack_child) {
		var length = haystack.length;
		if (haystack_child!="" && typeof haystack_child!="undefined"){
			for(var i = 0; i < length; i++) {
				if(haystack[i][haystack_child] == needle) return true;
			}
		}else{
			for(var i = 0; i < length; i++) {
				if(haystack[i] == needle) return true;
			}
		}
		return false;
	}
	
	function pop_cmb_box(box_id,table,value_field,text_field,selected_Value){
		var sel = document.getElementById(box_id);
		removeOptions(sel);
		for(var key in table) {
			var opt = document.createElement('option');
			if(table[key]!=null){
				opt.value = table[key][value_field];
                opt.innerHTML = table[key][text_field];
                if (table[key][value_field]==selected_Value)opt.selected = "SELECTED";
				sel.appendChild(opt);
			}
		}
	}
function pop_tool_cmb_box(box_id,table,value_field,text_field,selected_Value){
    var sel = document.getElementById(box_id);
    removeOptions(sel);

    ///////////////

    var arr =new Array(); //sorted list of keys
    var objcopy = new Array();
    objcopy=copyObject(table)
    var sort_key="priority";

    // create an array out of our obect
    for(var k in objcopy) {
        arr.push(objcopy[k])
    }

    arr.sort(//function(a, b) { return (a["group"] - b["group"])});
        function (a,b){
            var key1="priority"
            //var key2="group_leader"
           // var key3="name"

            //Sort group first Ascending
            if (a[key1]-b[key1]<0) return -1;
            if (a[key1]-b[key1]>0) return 1;
            return 0;
        });


    //////////////////

    var p=1;
    for(var key in arr) {

        if(arr[key]!=null){

            if (Math.floor(arr[key]['priority'])!=Math.floor(p)){
                var opt = document.createElement('option');
                opt.value =0;
                opt.innerHTML = "==========================";
                sel.appendChild(opt);

            }
            var opt = document.createElement('option');
            opt.value = arr[key][value_field];
            opt.innerHTML = arr[key][text_field];
            if (arr[key][value_field]==selected_Value)opt.selected = "SELECTED";

            sel.appendChild(opt);
            p=arr[key]['priority'];
        }
    }
}
function on_tool_type_change(control){
    var val=document.getElementById("tool_type").value;
    if (val==0){
        document.getElementById("tool_type").value=tpl['form_post']['tool_type'];

    }


}
	function copyObject(src){
		dest=new Array();
		for(var key1 in src) {
			dest[key1]={}
				for(var key2 in src[key1]) {
				dest[key1][key2]={}
					dest[key1][key2]=src[key1][key2]
				}

		}
		return dest;
	}

	function init_Material_cmb_box(box_id,table,value_field,text_field){
		var sel = document.getElementById(box_id);
	var arr =new Array(); //sorted list of keys
	var objcopy = new Array();
	objcopy=copyObject(table)
	var sort_key="group";
	
	// create an array out of our obect
	for(var k in objcopy) {
	arr.push(objcopy[k])
	}
	
	//arr.sort(function(a, b) { return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)); });
	//arr=objcopy;
	
	arr.sort(//function(a, b) { return (a["group"] - b["group"])});
		function (a,b){ 
			var key1="group"
			var key2="group_leader"
			var key3="name"

			//Sort group first Ascending
			if (a[key1]-b[key1]<0) return -1;
			if (a[key1]-b[key1]>0) return 1;
			
			//Sort Group leader Descending
			//if (a[key1] != b[key1]){
			if (a[key2] - b[key2]<0 ) return 1;
			if (a[key2] - b[key2]>0 ) return -1;
			
			//if group is on top sort members
			if (a[key1] == b[key1]){
			if (a[key3] > b[key3]) return 1;
			if (a[key3] < b[key3]) return -1;
			}
			//if (a[key1] != b[key1]){
			//}else{
			
			//}
			
			return 0;
		 }); 
		 
		 /*var sorto = {group:"asc",group_leader:"desc", name:"asc"};

arr.keySort(sorto);
*/
		 var spacer="";

		 var list = document.createElement('ul');
		list.className = 'dropdown_list';
		list.innerHTML = "";//src.innerHTML;

	for(var key in arr) {
	
		var opt = document.createElement('li');
		sel.value=arr[key][value_field];
	return;
	}
}

var popup={}
var page={}
function popUp_hide(){

		if (popup!= null && popup.parentNode!= null){
			
			popup.style.visibility="hidden";
			//popup.style.display="none";
			//delay deleting this shit so that it does not jump top the top
			clearInterval(page.counter);
				page.counter = setInterval(function (e){
						clearInterval(page.counter);
							popup.parentNode.removeChild(popup);
							window.scrollTo(0,page.scholl_offset);
//							page.div.style.visibility="visible";
							page.div.style.display="block";
							page.div.style.opacity="1";
							//page.div.style.position="relative";
							popup_down=false;
						}, 1);
			
			
			
		}	
		
		
		
			
			//alert("hidden!")
}


function pop_Material_cmb_box(box_id,table,value_field,text_field){
if (popup_down==true){return;}
//first lock the parent body
page.div = document.getElementById("div_body");

		popup_down=true;
		var sel = document.getElementById(box_id);
page.scholl_offset=document.body.scrollTop

		//create popup

		//window.scrollTo(0, 0);
		popup = document.createElement('div');
		popup.className = 'popup';
		popup.id = 'popup';
		popup.style.height=viewport().height;
		var header = document.createElement('div');
		header.className = 'popup_header';
		header.innerHTML = "Workpiece Material";
		
		var cancel = document.createElement('div');
		cancel.className = 'popup_header_cancel';
		cancel.innerHTML = '';
		cancel.onclick = function (e) {
			popUp_hide();
		};
		var message = document.createElement('div');
		message.className = 'popup_message';
		if (lic_type!="pro") message.innerHTML = "<span>Please purchase FSWizard PRO to get access to all workpiece materials.</span>";



	var arr =new Array(); //sorted list of keys
	var objcopy = new Array();
	objcopy=copyObject(table)
	var sort_key="group";
	
	// create an array out of our obect
	for(var k in objcopy) {
	arr.push(objcopy[k])
	}
	
	//arr.sort(function(a, b) { return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)); });
	//arr=objcopy;
	
	arr.sort(//function(a, b) { return (a["group"] - b["group"])});
		function (a,b){ 
			var key1="group"
			var key2="group_leader"
			var key3="name"

			//Sort group first Ascending
			if (a[key1]-b[key1]<0) return -1;
			if (a[key1]-b[key1]>0) return 1;
			
			//Sort Group leader Descending
			//if (a[key1] != b[key1]){
			if (a[key2] - b[key2]<0 ) return 1;
			if (a[key2] - b[key2]>0 ) return -1;
			
			//if group is on top sort members
			if (a[key1] == b[key1]){
			if (a[key3] > b[key3]) return 1;
			if (a[key3] < b[key3]) return -1;
			}
			//if (a[key1] != b[key1]){
			//}else{
			
			//}
			
			return 0;
		 }); 
		 
		 /*var sorto = {group:"asc",group_leader:"desc", name:"asc"};

arr.keySort(sorto);
*/
		 var spacer="";

		 var list = document.createElement('ul');
		list.className = 'dropdown_list';
		list.innerHTML = "";//src.innerHTML;

	for(var key in arr) {
		var opt = document.createElement('li');

		if (arr[key]["group_leader"]==0){
			//spacer="&nbsp;&nbsp;&nbsp;";
		}else{
			//spacer=arr[key]["group"]+") ";
			opt.className="header";
		}

		opt.value = arr[key][value_field];
		//sel.value=arr[key][value_field]
		//
		/*opt.ontouchstart=function (e) {
			page.touch={}
			page.touch.x=e.clientX
			page.touch.y=e.clientY
		
		}*/
		
		opt.onmouseover= function (e) {
			this.className="selected";
		};
		opt.onmouseout= function (e) {
			this.className="";
		};
		opt.ontouchend= function (e) {
			this.className="";
		};
		opt.onclick= function (e) {
		

				popUp_hide();

				sel.value=this.value
				this.className="selected";
				//document.getElementById("popup").style.opacity = 0;
				
				//document.getElementById(box_id).scrollIntoView();
				//drawToast("Loading...");
				//clearInterval(intervalCounter2);
				//var intervalCounter2 = setInterval(function (e){
				//	clearInterval(intervalCounter2);
						elem_onchange();
				//		}, 300);
		};
		
		
		
		opt.innerHTML =spacer+ arr[key][text_field];
		if (sel.value==arr[key][value_field]){
			opt.className="selected";
			opt.id="dropdown_list_selected"
		}
		list.appendChild(opt);
		
	}
		message.appendChild(list);
		header.appendChild(cancel);
		popup.appendChild(header);                                    
		popup.appendChild(message);
		popup.style.visibility="hidden"		
		
		//page.div.style.position="fixed";
		page.div.style.opacity="0";
//		page.div.style.visibility="hidden";
		page.div.style.display="block";

		document.body.appendChild(popup);
		
		document.getElementById("popup").style.opacity = 0;
		document.getElementById("popup").style.visibility="visible";
		document.getElementById("dropdown_list_selected").scrollIntoView();
		document.getElementById("popup").style.opacity = 1;
}

function init_FSWIZARD(){
		//Set keyboard the size of viewport
		var fs=document.getElementById("fswizard");
		fs.style.bottom="0px"; 
		fractions_Enable();
		//init Tabs
		tabs_init('tab_8')
		tabs_init('tab_2');
		
		tabs_init('tab_fillet_1');

		tabs_init('tab_bolt_hole_1');
        tabs_init('tab_bolt_line_1');
        tabs_init("tab_drill_point_1");
        tabs_init("tab_true_position_1");


    pushmenu_show_panel("panel_fswizard");
		//scrolls_Enable();
		
		
		//check if scrolling is native
		//if (!hasOverflowScrolling()){ touchScroll("pushmenu");}
		
		/*touchScroll("reference_table_scroll_2")
		touchScroll("fswizard")*/
		current_parent="panel_about";
		if (lic_type=="pro"){
		editStyleByName("license_pro","display","")
		db_text=db_text_pro;
		editElementByName("version_level","innerHTML","Pro");
		}else{
		editStyleByName("license_lite","display","")
		db_text=db_text_lite;
		editElementByName("version_level","innerHTML","Lite");

		}
		editElementByName("version_number","innerHTML",version);
		// LOAD ALL TABLES INTO THE DB object
	//tables:
	//skv_fswizard_tool_type
	//skv_fswizard_chipload
	//skv_fswizard_material
	//skv_fswizard_tool_material
	//skv_fswizard_tool_coating

	
	/*db.chipload=new Object(load_table(db_text,"skv_fswizard_chipload"));
	db.material=new Object(load_table(db_text,"skv_fswizard_material"));
	db.tool_coating=load_table(db_text,"skv_fswizard_tool_coating");
	db.tool_material=load_table(db_text,"skv_fswizard_tool_material");
	db.tool_type=load_table(db_text,"skv_fswizard_tool_type");
	
	db.threads={};
	db.threads.forms=new Object(XML_Get_Table(db_threads,"form"));
	db.threads.threads=new Object(XML_Get_Table(db_threads,"thread"));
	db.threads.drills=new Object(XML_Get_Table(db_threads,"drill"));
	*/

	db=json_db;
	db=trim_nulls(db);
	
	/*init_Material_cmb_box('material',db.material,"id","name");
	pop_cmb_box('tool_type',db.tool_type,"id","name");
	pop_cmb_box('tool_material',db.tool_material,"id","name");
	pop_cmb_box('tool_coating',db.tool_coating,"id","name");

	pop_cmb_box('tool_thread_form',db.threads.forms,"name","name");
	tool_thread_form_changed();

	document.getElementById("form_post_tool_rpm_adj").value="100";
	document.getElementById("form_post_tool_feed_adj").value="100";
     */
	//load settings
		fs_wizard_load_state();
	//load last calculation!
		var ret=localStorage.getItem('FSWizard_last_state');
		var ver=localStorage.getItem('FSWizard_version');

		if (ver!=version){
		//clear local store if version changed!!!
				localStorage.clear();
		}
		var ttt={}
        if (ret!== null && ver==version){
            //load last state!
            tpl=JSON.parse(ret);
        }
    //End looad last state
    //Begin Initializing Dropdowns

    init_Material_cmb_box('material',db.material,"id","name");
    pop_tool_cmb_box('tool_type',db.tool_type,"id","name");

    pop_cmb_box('tool_material',db.tool_material,"id","name");
    pop_cmb_box('tool_coating',db.tool_coating,"id","name");

    pop_cmb_box('tool_thread_form',db.threads.forms,"name","name",tpl['form_post']['tool_thread_form']);
    tool_thread_form_changed();

    document.getElementById("form_post_tool_rpm_adj").value="100";
    document.getElementById("form_post_tool_feed_adj").value="100";


    calc_run=true;
    if (ret!== null && ver==version){
        //
         calc_fswizard("",true);
    }else{
        //run calc function
        popUp('release_notes_div','Release Notes');
        calc_fswizard();
    }


//add listener to wait for screen rotation:
/*	var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
	window.addEventListener(orientationEvent, on_resize(), false);
*/
		
		
}

function fs_wizard_calc_turn(control){
//
mat_id=tpl['form_post']['material'];
tool_id=tpl['form_post']['tool_type'];
tool_mat_id=tpl['form_post']['tool_material'];
tool_coat_id=tpl['form_post']['tool_coating'];
mat_power=db['material'][mat_id]['kp'];
if(!tpl['form_post']['units'])tpl['form_post']['units']="in";
tpl['units']=tpl['form_post']['output_units']; // just for esy reding
unit=1;
if(tpl['units']=="mm"){
	tpl['result']['units_sfm']="m/min";
	tpl['result']['units_vol']="cm^3/min";
	tpl['result']['units_pow']="kW";
	tpl['result']['units_torque']="Nm";
	tpl['result']['units_force']="N";
	tpl['result']['units']="mm";
	unit=25.4; // Convert inch output to metric	
}else{
	tpl['result']['units_sfm']="f/min";
	tpl['result']['units_vol']="in^3/min";
	tpl['result']['units_pow']="HP";
	tpl['result']['units_torque']="in-lb";
	tpl['result']['units_force']="lb";
	tpl['result']['units']="in";
}
tpl['form_error']['error']="0";

// calc ideal lenght of a tool
tpl['form_post']['tool_ideal_length']=Math.abs(db.tool_type[tool_id]['tool_len']);



//tpl['form_post']['tool_ideal_length_abs']=db.tool_type[tool_id]['tool_len_abs'];
if(db.tool_type[tool_id]['flute_len']>=0){
	tpl['form_post']['tool_ideal_flute_length']=Math.abs(db.tool_type[tool_id]['flute_len']);
}else{
	tpl['form_post']['tool_ideal_flute_length']=Math.abs(db.tool_type[tool_id]['flute_len']);

}
//tpl['form_post']['tool_ideal_flute_length_abs']=db.tool_type[tool_id]['flute_len_abs'];

//tpl['form_post']['tool_ideal_helix']=db.tool_type[tool_id]['helix'];

if (tpl['form_post']['tool_shank_diameter']<=0)tpl['form_post']['tool_shank_diameter']=1;
//ideal Depth of cut acc to dia || flute lenght  && number of inserts
//ideal  Slot depth of Cut

	//tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_diameter']/2;
/*	if (tpl['form_post']['tool_flute_n']>4)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==4)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==3)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==2)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==1)flute_divider=1;
if (db.tool_type[tool_id]['slot_doc']>=0){
	tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['slot_doc']*flute_divider;
}else{
	tpl['form_post']['tool_ideal_slot_doc']=Math.abs(db.tool_type[tool_id]['slot_doc']);
}*/
if (db.tool_type[tool_id]['side_doc']>=0){
	tpl['form_post']['tool_ideal_side_doc']=tpl['form_post']['tool_shank_diameter']*db.tool_type[tool_id]['side_doc'];
}else{
	tpl['form_post']['tool_ideal_side_doc']=Math.abs(db.tool_type[tool_id]['side_doc']);
}
//tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['side_woc'];

	tpl['form_post']['tool_ideal_doc']=Math.abs(tpl['form_post']['tool_ideal_side_doc']);
	
//Ideal SFM /ipt
//helix factors
/*if (tpl['form_post']['tool_helix']==="0"){
tpl['form_post']['tool_helix']="0.0";
}
if (tpl['form_post']['tool_helix']===""){
tpl['form_post']['tool_helix']=db.tool_type[tool_id]['helix'];
}
if (tpl['form_post']['tool_helix']<0 ){
tpl['form_post']['tool_helix']="0.0";
}

if (tpl['form_post']['tool_helix']>70){
tpl['form_post']['tool_helix']=70;
}*/
//axial angle for lead angle
if (!tpl['form_post']['tool_leadangle'] || tpl['form_post']['tool_leadangle']<0 ){
tpl['form_post']['tool_leadangle']=db.tool_type[tool_id]['leadangle'];
}
if (!tpl['form_post']['tool_leadangle']){
tpl['form_post']['tool_leadangle']="90.0";
}

if (tpl['form_post']['tool_leadangle']<5){
tpl['form_post']['tool_leadangle']=5;
}

if (tpl['form_post']['tool_leadangle']>175){
tpl['form_post']['tool_leadangle']=175;
}



if (!tpl['form_post']['tool_corner_rad'] || tpl['form_post']['tool_corner_rad']<0 ){
tpl['form_post']['tool_corner_rad']="0.0";
}
if (tpl['form_post']['tool_corner_rad']>tpl['form_post']['tool_diameter']/2){
//tpl['form_post']['tool_corner_rad']=tpl['form_post']['tool_diameter']/2;
}
//tpl['result']['helix_factor']=1+Math.cos(deg2rad(30))-Math.cos(deg2rad(tpl['form_post']['tool_helix']));
/*tpl['result']['helix_factor']=1+(Math.sin(deg2rad(tpl['form_post']['tool_helix']))-Math.sin(deg2rad(30)))*.5;
if (tpl['result']['helix_factor']>1){
//	tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*tpl['result']['helix_factor'];
 
}*/

//check max rpm
if (tpl['form_post']['machine_max_rpm']<=0){
	tpl['form_post']['machine_max_rpm']=10000;
		//tpl['form_error']['maxhine_max_rpm']="Max RPM is 10000 by default";
}
//Check Dia
if(tpl['form_post']['tool_diameter']<=0){
tpl['form_error']['tool_diameter']="Turn Diameter is required";
}
//Check number of flutes
if(tpl['form_post']['tool_flute_n']<=0){
//tpl['form_error']['tool_flute_n']="Number of Flutes is required";
tpl['form_post']['tool_flute_n']=db.tool_type[tool_id]['flutes'];

}

// if !len = ideal len



if(!tpl['form_post']['tool_length']){
tpl['form_post']['tool_length']=Math.abs( tpl['form_post']['tool_ideal_length']);
//tpl['form_error']['tool_length']="Tool Length is ".tpl['form_post']['tool_length']*unit.tpl['units']."";
}


// if ! flute len = ideal flute len
if(!tpl['form_post']['tool_flute_length']){
tpl['form_post']['tool_flute_length']=(tpl['form_post']['tool_ideal_flute_length']?tpl['form_post']['tool_ideal_flute_length']:tpl['form_post']['tool_ideal_flute_length_abs']);
//tpl['form_error']['tool_flute_length']="Flute Length is ".tpl['form_post']['tool_ideal_flute_length']*unit.tpl['units']."";
}
// if  flute len > Len
if(tpl['form_post']['tool_flute_length']>tpl['form_post']['tool_length']){
tpl['form_post']['tool_flute_length']=Math.abs( tpl['form_post']['tool_length']);
tpl['form_error']['tool_flute_length']="Limited to tool length";
}

if(!tpl['form_post']['tool_rpm_adj']){
tpl['form_post']['tool_rpm_adj']=100;
}
if(!tpl['form_post']['tool_feed_adj']){
tpl['form_post']['tool_feed_adj']=100;
}


prod_Value=4;
Prod_Factor=prod_Value/ 8 + 0.5;
prod_power=0.25 - (prod_Value / 32);

tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*Prod_Factor;
tid=tpl['form_post']['tool_ideal_doc'];
//if tool length >regular length then
//0.5 is a productivity factor

if((tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length'])){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_shank_diameter'],3)*Math.pow((tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length']),2*prod_power);
}
/*if((tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length'])  && !is_slot){
	tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_ideal_woc']*Math.pow(tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length'],2*Prod_Factor)*tpl['result']['helix_factor'];
}*/

//tool shank factor
if (tid>tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_shank_diameter']/1,3)){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_shank_diameter']/tpl['form_post']['tool_diameter'],3);
}else{
tpl['form_post']['tool_ideal_doc']=tid;
}
if (tpl['form_post']['tool_flute_length'] > tpl['form_post']['tool_ideal_flute_length'] ){
            tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*(tpl['form_post']['tool_ideal_flute_length']/tpl['form_post']['tool_flute_length']) * 0.8;
}

/*if (tpl['form_post']['tool_flute_length'] > tpl['form_post']['tool_ideal_flute_length'] ){
            tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_ideal_woc']*(tpl['form_post']['tool_ideal_flute_length']/tpl['form_post']['tool_flute_length']) * 0.8;
}
*/

//adjust tool ideal doc acc to material cut
        mat_doc_adjust = mat_power / 0.8;
        if (mat_doc_adjust < 1 ) mat_doc_adjust = 1;
		//'echo mat_doc_adjust;
       tpl['form_post']['tool_ideal_doc'] = tpl['form_post']['tool_ideal_doc'] / mat_doc_adjust;

//-------------------------------- Begin Cut balance here---------------------
//tis=tpl['form_post']['tool_ideal_woc']*tpl['form_post']['tool_ideal_doc'];
tool_ideal_doc=tpl['form_post']['tool_ideal_doc'];
//tool_ideal_woc=tpl['form_post']['tool_ideal_woc'];

/*if(tpl['form_post']['tool_doc']){
	//if DOC != ideal when not slotting then reduce WOC
	if(!is_slot  && tpl['form_post']['tool_doc']!=tpl['form_post']['tool_ideal_doc']){
		tpl['form_post']['tool_ideal_woc']=tis/tpl['form_post']['tool_doc'];
	}
}

if(tpl['form_post']['tool_woc']){
	//if WOC != ideal when not slotting then reduce DOC
	if(!is_slot  && tpl['form_post']['tool_woc']!=tpl['form_post']['tool_ideal_woc']){
		tpl['form_post']['tool_ideal_doc']=tis/tpl['form_post']['tool_woc'];
	}
}
*/

//----------------------------------------------------------------------------


// Check if ideal slot DOC > Flute
/*
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_ideal_slot_doc']){
tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_flute_length']-.001;
//tpl['form_error']['tool_ideal_slot_doc']="Depth of Cut was limited to Flute Length";
}
*/
// Check if ideal DOC > Flute
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_ideal_doc']){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_flute_length'];
}

// Check if ideal woc> dia
/*if(tpl['form_post']['tool_diameter']<tpl['form_post']['tool_ideal_woc']){
tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_diameter'];
}
*/
// Check if real DOC > Flute
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_doc']){
tpl['form_post']['tool_doc']=tpl['form_post']['tool_flute_length'];
//tpl['form_error']['tool_doc']="Depth of Cut="+tpl['form_post']['tool_doc']*unit.tpl['units']+"";
}
/*
// Check if WOC > diameter
if(tpl['form_post']['tool_woc']>tpl['form_post']['tool_diameter']){
tpl['form_post']['tool_woc']=tpl['form_post']['tool_diameter'];
tpl['form_error']['tool_woc']="Width Of Cut=".tpl['form_post']['tool_diameter']*unit.tpl['units']."";
}
*/

// Check if DOC =0
if(!tpl['form_post']['tool_doc']){
tpl['form_post']['tool_doc']=tpl['form_post']['tool_ideal_doc'];
//tpl['form_error']['tool_doc']="Depth of Cut=".tpl['form_post']['tool_ideal_doc']*unit.tpl['units']."";
}
// Check if woc =0
/*
if(!tpl['form_post']['tool_woc']){
tpl['form_post']['tool_woc']=tpl['form_post']['tool_ideal_woc'];
tpl['form_error']['tool_woc']="Width of Cut=".tpl['form_post']['tool_ideal_woc']*unit.tpl['units']."";
}
*/
// Adjust Max RPM according to length of the tool
//Formula from www.cncroutersource.com/critical-speed-calculator.html
//Support type=0.25 Fixed-Free
//Safety factor=2

CRPMDIA=(tpl['form_post']['tool_diameter']>=tpl['form_post']['tool_shank_diameter'] ? tpl['form_post']['tool_diameter'] : tpl['form_post']['tool_shank_diameter']);
critical_RPM=(4.76*Math.pow(10,6)*CRPMDIA*0.25)/(2*Math.pow(tpl['form_post']['tool_length'],2));
critical_RPM_adj=1;


//ideal radial chip thinning factors
/*if(tpl['form_post']['tool_ideal_woc']*2<tpl['form_post']['tool_diameter']){
tpl['result']['chip_radial_ideal_thinning_factor']=1/Math.sqrt(1-Math.pow((1-((2*tpl['form_post']['tool_ideal_woc'])/tpl['form_post']['tool_diameter'])),2));
if (tpl['result']['chip_radial_ideal_thinning_factor']==0)tpl['result']['chip_radial_ideal_thinning_factor']=1;
if (tpl['result']['chip_radial_ideal_thinning_factor']>3)tpl['result']['chip_radial_ideal_thinning_factor']=3;
}else{
tpl['result']['chip_radial_ideal_thinning_factor']=1;
}
*/
//real radial chip thinning factors
/*
if(tpl['form_post']['tool_woc']*2<tpl['form_post']['tool_diameter']){
tpl['result']['chip_radial_real_thinning_factor']=1/Math.sqrt(1-Math.pow((1-((2*tpl['form_post']['tool_woc'])/tpl['form_post']['tool_diameter'])),2));
if (tpl['result']['chip_radial_real_thinning_factor']==0)tpl['result']['chip_radial_real_thinning_factor']=1;
if (tpl['result']['chip_radial_real_thinning_factor']>3)tpl['result']['chip_radial_real_thinning_factor']=3;
}else{
tpl['result']['chip_radial_real_thinning_factor']=1;
}*/
//Shank Torque factors
//T_Factor=Math.pow(tpl['form_post']['tool_shank_diameter']/tpl['form_post']['tool_diameter'],2);
//if (T_Factor > 1)T_Factor = 1; 
//= 1; 
//effective diameter ED = 2a?s RA?-(R-DOC)A?
if (tpl['form_post']['tool_doc']<tpl['form_post']['tool_corner_rad']){
	tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter']-(2*tpl['form_post']['tool_corner_rad'])+(2*Math.sqrt(Math.pow(tpl['form_post']['tool_corner_rad'],2)-Math.pow(tpl['form_post']['tool_corner_rad']-tpl['form_post']['tool_doc'],2)));
	//real axial chip thinning factors
	tpl['result']['chip_axial_real_thinning_factor']=1/Math.sqrt(1-Math.pow((1-((tpl['form_post']['tool_doc'])/tpl['form_post']['tool_corner_rad'])),2));
	if (tpl['result']['chip_axial_real_thinning_factor']==0)tpl['result']['chip_axial_real_thinning_factor']=1;
	//if (tpl['result']['chip_axial_real_thinning_factor']>10)tpl['result']['chip_axial_real_thinning_factor']=10;
}else{ 
	tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter'];
	//tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter']+(tan(deg2rad(tpl['form_post']['tool_leadangle'])*tpl['form_post']['tool_doc']));

	tpl['result']['chip_axial_real_thinning_factor']=1/Math.sin(deg2rad(tpl['form_post']['tool_leadangle']));
	if (tpl['result']['chip_axial_real_thinning_factor']==0)tpl['result']['chip_axial_real_thinning_factor']=1;
	//if (tpl['result']['chip_axial_real_thinning_factor']>10)tpl['result']['chip_axial_real_thinning_factor']=10;
}

HSM_SFM_Factor=1;
if (tpl['form_post']['chip_thinning']==1){
	tpl['result']['chip_real_thinning_factor']=tpl['result']['chip_axial_real_thinning_factor'];
	//HSM_SFM_Factor = tpl['result']['chip_radial_real_thinning_factor']*1.5-.5;
   // if (HSM_SFM_Factor > 2.5 )HSM_SFM_Factor = 2.5;

}else{
	tpl['result']['chip_real_thinning_factor']=1;
}

//THREADING if we are doing internal Arc then

//Ax/rad eng %
/*tpl['tool_ideal_woc_pc']=tpl['form_post']['tool_ideal_woc']/tpl['form_post']['tool_diameter']*100;
tpl['tool_ideal_doc_pc']=tpl['form_post']['tool_ideal_doc']/tpl['form_post']['tool_diameter']*100;
tpl['tool_ideal_slot_doc_pc']=tpl['form_post']['tool_ideal_slot_doc']/tpl['form_post']['tool_diameter']*100;
*/
//Ax/rad eng %
//tpl['result']['tool_woc_pc']=tpl['form_post']['tool_woc']/tpl['form_post']['tool_diameter']*100;
tpl['result']['tool_doc_pc']=tpl['form_post']['tool_doc']/tpl['form_post']['tool_diameter']*100;

//tool_flute_chipload_dec = (tpl['tool_chipload']* tpl['form_post']['tool_flute_n']* 5 / 100);
 //       if (tool_flute_chipload_dec > tpl['tool_chipload'] / 2 )tool_flute_chipload_dec = tpl['tool_chipload']/ 2;
       
tpl['form_post']['tool_ideal_sfm']=tpl['c_material']['sfm']*tpl['c_tool_type']['sfm']*tpl['c_tool_material']['sfm']*tpl['c_tool_coating']['sfm']*HSM_SFM_Factor;

tpl['form_post']['tool_ideal_ipt']=tpl['c_material']['ipt']*tpl['c_tool_material']['ipt']*tpl['c_tool_type']['ipt'];
tpl['form_post']['tool_ideal_rpm']=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_ideal_feed']=tpl['form_post']['tool_ideal_rpm']*tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_flute_n'];


ttrig = (tpl['form_post']['tool_length']/tpl['form_post']['tool_ideal_length']);
tpl['form_post']['tool_doc_factor']=tpl['form_post']['tool_doc']/tool_ideal_doc;
//tpl['form_post']['tool_woc_factor']=tpl['form_post']['tool_woc']/tool_ideal_woc;


//if we are slotting then:

tpl['form_post']['tool_load_factor']=tpl['form_post']['tool_doc_factor'];


tpl['form_post']['tool_load_feed_factor']=1/tpl['form_post']['tool_load_factor'];

// Limit load factors
//if len/load/feed is >100% then we limit it
max_f_increase=1/mat_power*1.5;
if (max_f_increase>1.5)max_f_increase=1.5;
/*if (tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_radial_real_thinning_factor']*tpl['result']['chip_axial_real_thinning_factor']>max_f_increase){
	tpl['form_post']['tool_load_feed_factor']=max_f_increase/(tpl['result']['chip_radial_real_thinning_factor']*tpl['result']['chip_axial_real_thinning_factor']);
	tpl['form_error']['tool_load_feed_factor']="Tip: increase material load";
}*/
if (tpl['form_post']['tool_load_feed_factor']>max_f_increase){
	tpl['form_post']['tool_load_feed_factor']=max_f_increase;
	tpl['form_error']['tool_load_feed_factor']="Tip: increase material load";
}
if (tpl['form_post']['tool_load_feed_factor']<0.5){
	tpl['form_post']['tool_load_feed_factor']=0.5;
}

//tpl['form_post']['tool_load_feed_factor']=1;// ahh fuck it1111111111111111
//----calculate intermidiate rpm without ovveride
int_r_rpm=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
if (int_r_rpm>critical_RPM){
critical_RPM_adj=critical_RPM/int_r_rpm;
//tpl['form_error']['tool_length']="Reduced RPM";
}

//calculate manually entered speed and feed
var tool_real_sfm=tpl['form_post']['tool_ideal_sfm']*critical_RPM_adj;
var tool_real_rpm=12*tool_real_sfm/tpl['result']['tool_effective_diameter']/3.14;
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_sfm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_sfm']/tool_real_sfm*100;
	}
	if (control.name== "tool_real_rpm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_rpm']/tool_real_rpm*100;
	}
}
tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_ideal_sfm']*tpl['form_post']['tool_rpm_adj']*critical_RPM_adj/100;
var tool_real_rpm=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
var tool_real_ipt=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor'];
var tool_real_feed=tool_real_rpm*tool_real_ipt*tpl['form_post']['tool_flute_n'];
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_ipt"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_ipt']/tool_real_ipt*100;
	}
	if (control.name== "tool_real_feed"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_feed']/tool_real_feed*100;
	}
}
tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor']*tpl['form_post']['tool_feed_adj']/100;




///////Here we limis SFM by max machine RPM
rpm=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
rpm_d=rpm/tpl['form_post']['machine_max_rpm'];
if (rpm_d>1){
	tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_real_sfm']/rpm_d;
	//tpl['form_error']['tool_real_rpm']="RPM Limited by MAX machine spindle speed";

}

//////////////
/*if (tpl['form_post']['tool_real_ipt']/tpl['form_post']['tool_ideal_ipt']>1.5){
	tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt']*1.5;
	tpl['form_error']['tool_real_ipt']="Chip Load was limited to 150%";
	}
*/
//avg chip=(360*chipload*with_o_cut)/(3.14*Diam*Eng_angle)*Math.sin(deg2rad(90-helixang))
//KC11=
//tpl['tool_real_avg_chip']=;

tpl['result']['chip_real_thickness']=tpl['form_post']['tool_real_ipt']/tpl['result']['chip_real_thinning_factor'];


tpl['form_post']['tool_real_rpm']=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_rpm']*tpl['form_post']['tool_real_ipt']*tpl['form_post']['tool_flute_n'];

tpl['result']['tool_real_mrr']=tpl['form_post']['tool_doc']*tpl['form_post']['tool_real_feed'];
tpl['result']['tool_real_hp']=tpl['result']['tool_real_mrr']*mat_power/tpl['result']['helix_factor'];
//I = pi x d^4 / 64 
tpl['result']['tool_real_torque']=tpl['result']['tool_real_hp']*63030/tpl['form_post']['tool_real_rpm'];
tpl['result']['tool_real_force']=tpl['result']['tool_real_torque']/tpl['result']['tool_effective_diameter']*2;
//f=(FL^3)/(3EI)



if (tpl['form_post']['tool_real_rpm']>tpl['form_post']['machine_max_rpm']){
	tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_feed']*tpl['form_post']['machine_max_rpm']/tpl['form_post']['tool_real_rpm'];
	tpl['form_post']['tool_real_rpm']=tpl['form_post']['machine_max_rpm'];
		tpl['form_error']['tool_real_rpm']="RPM Limited by MAX machine spindle speed";

}


}


function fs_wizard_calc_drill(control){
//
mat_id=tpl['form_post']['material'];
tool_id=tpl['form_post']['tool_type'];
tool_mat_id=tpl['form_post']['tool_material'];
tool_coat_id=tpl['form_post']['tool_coating'];
mat_power=db['material'][mat_id]['kp'];
if(!tpl['form_post']['units'])tpl['form_post']['units']="in";
tpl['units']=tpl['form_post']['output_units']; // just for esy reding
unit=1;
L_S_Factor=1;

if(tpl['units']=="mm"){
	tpl['result']['units']="mm";
	tpl['result']['units_sfm']="m/min";
	tpl['result']['units_pow']="kW";	
	tpl['result']['units_vol']="cm^3/min";
	tpl['result']['units_torque']="Nm";
	tpl['result']['units_force']="N";
	unit=25.4; // Convert inch output to metric	
}else{
	tpl['result']['units']="in";
	tpl['result']['units_sfm']="f/min";
	tpl['result']['units_pow']="HP";
	tpl['result']['units_vol']="in^3/min";
	tpl['result']['units_torque']="in-lb";
	tpl['result']['units_force']="lb";
}
tpl['form_error']['error']="0";

tpl['form_post']['tool_ideal_length']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['tool_len'];

tpl['form_post']['tool_ideal_helix']=db.tool_type[tool_id]['helix'];

//check max rpm
if (tpl['form_post']['machine_max_rpm']<=0){
	tpl['form_post']['machine_max_rpm']=10000;
		//tpl['form_error']['maxhine_max_rpm']="Max RPM is 10000 by default";
}
//Check Dia
if(tpl['form_post']['tool_diameter']<=0){
//tpl['form_error']['tool_diameter']="Tool Diameter is required";
}
//Check number of flutes
if (tpl['form_post']['tool_flute_n']==0 ||tpl['form_post']['tool_flute_n']==""){
tpl['form_post']['tool_flute_n']=db.tool_type[tool_id]['flutes'];
}
if (tpl['c_tool_type']['type']=='ream'){
	if (tpl['form_post']['tool_flute_n']<4 || tpl['form_post']['tool_flute_n']>10){
		//tpl['form_error']['tool_flute_n']="Unusual Number of Flutes";
	}
}else{ //drill
	if (tpl['form_post']['tool_flute_n']!=db.tool_type[tool_id]['flutes']){
		tpl['form_error']['tool_flute_n']="Unusual Number of Flutes<br>Default number is:"+db.tool_type[tool_id]['flutes'];
	}
}
	
if (tpl['form_post']['tool_helix']=="0"){
tpl['form_post']['tool_helix']="0.0";
}
if (tpl['form_post']['tool_helix']==""){
tpl['form_post']['tool_helix']=tpl['form_post']['tool_ideal_helix'];
}
if (tpl['form_post']['tool_helix']<0 ){
tpl['form_post']['tool_helix']=0;
}

if (tpl['form_post']['tool_helix']>60){
tpl['form_post']['tool_helix']=60;
}
// if !len 
if(!tpl['form_post']['tool_length']){
tpl['form_post']['tool_length']=tpl['form_post']['tool_ideal_length'];
//tpl['form_error']['tool_length']="Tool Length is ".tpl['form_post']['tool_length']*unit.tpl['units']."";
}

pilot_size=tpl['form_post']['tool_diameter']*tpl['c_tool_type']['pilot_size'];

if(!tpl['form_post']['tool_rpm_adj']){
tpl['form_post']['tool_rpm_adj']=100;
}
if(!tpl['form_post']['tool_feed_adj']){
tpl['form_post']['tool_feed_adj']=100;
}

//if tool length >regular length then
if(tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length']){
	L_S_Factor=Math.pow(tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length'],2);
}
// Adjust Max RPM according to length of the tool
//Formula from www.cncroutersource.com/critical-speed-calculator.html
//Support type=0.25 Fixed-Free
//Safety factor=2
critical_RPM=(4.76*Math.pow(10,6)*tpl['form_post']['tool_diameter']*0.25)/(2*Math.pow(tpl['form_post']['tool_length'],2));
critical_RPM_adj=1;
if (tpl['form_post']['tool_helix']<0 || tpl['form_post']['tool_helix']>60){
tpl['form_post']['tool_helix']=tpl['form_post']['tool_ideal_helix'];
}
tpl['result']['helix_factor']=1+(Math.sin(deg2rad(tpl['form_post']['tool_helix']))-Math.sin(deg2rad(15)))*.5;
tpl['form_post']['tool_ideal_sfm']=tpl['c_material']['sfm']*tpl['c_tool_type']['sfm']*tpl['c_tool_material']['sfm']*tpl['c_tool_coating']['sfm'];
tpl['form_post']['tool_ideal_ipt']=tpl['tool_chipload']*tpl['c_tool_type']['ipt']*tpl['c_material']['ipt']/tpl['tool_05_chipload']*1.5;
tpl['form_post']['tool_ideal_rpm']=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_ideal_feed']=tpl['form_post']['tool_ideal_rpm']*tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_flute_n'];

//----calculate intermidiate rpm without ovveride
int_r_rpm=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
if (int_r_rpm>critical_RPM){
critical_RPM_adj=critical_RPM/int_r_rpm;
//tpl['form_error']['tool_length']="Reduced RPM";
}

//calculate manually entered speed and feed
var tool_real_sfm=tpl['form_post']['tool_ideal_sfm']*critical_RPM_adj;
var tool_real_rpm=12*tool_real_sfm/tpl['result']['tool_effective_diameter']/3.14;
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_sfm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_sfm']/tool_real_sfm*100;
	}
	if (control.name== "tool_real_rpm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_rpm']/tool_real_rpm*100;
	}
}
tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_ideal_sfm']*tpl['form_post']['tool_rpm_adj']*critical_RPM_adj/100;
var tool_real_rpm=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
var tool_real_ipt=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor'];
var tool_real_feed=tool_real_rpm*tool_real_ipt*tpl['form_post']['tool_flute_n'];
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_ipt"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_ipt']/tool_real_ipt*100;
	}
	if (control.name== "tool_real_feed"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_feed']/tool_real_feed*100;
	}
}
tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor']*tpl['form_post']['tool_feed_adj']/100;



///////Here we limis SFM by max machine RPM
rpm=12*tpl['form_post']['tool_real_sfm']/tpl['form_post']['tool_diameter']/3.14;
rpm_d=rpm/tpl['form_post']['machine_max_rpm'];
if (rpm_d>1){
	tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_real_sfm']/rpm_d;
}

tpl['form_post']['tool_real_rpm']=12*tpl['form_post']['tool_real_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_rpm']*tpl['form_post']['tool_real_ipt']*tpl['form_post']['tool_flute_n'];

tpl['result']['tool_real_mrr']=((Math.pow(tpl['form_post']['tool_diameter'],2)*3.14)-(Math.pow(pilot_size,2)*3.14))*tpl['form_post']['tool_real_feed']/4;
tpl['result']['tool_real_hp']=tpl['result']['tool_real_mrr']*mat_power/tpl['result']['helix_factor'];

tpl['result']['tool_real_torque']=tpl['result']['tool_real_hp']*63030/tpl['form_post']['tool_real_rpm']; //result in in-lb

//echo tpl['form_post']['tool_ideal_doc'];
//hss uts=145037 psi

flute_n_tor=(3.14/16)*tpl['c_tool_material']['uts']*.58*Math.pow(tpl['form_post']['tool_diameter'],3)*.75/12; // result in in-lb
tpl['result']['tool_normal_torque']=flute_n_tor; // 


}//end of drill

function fs_wizard_calc_tap(control){
//
mat_id=tpl['form_post']['material'];
tool_id=tpl['form_post']['tool_type'];
tool_mat_id=tpl['form_post']['tool_material'];
tool_coat_id=tpl['form_post']['tool_coating'];
mat_power=db['material'][mat_id]['kp'];
if(!tpl['form_post']['units'])tpl['form_post']['units']="in";
tpl['units']=tpl['form_post']['output_units']; // just for esy reding
unit=1;
L_S_Factor=1;

if(tpl['units']=="mm"){
	tpl['result']['units']="mm";
	tpl['result']['units_sfm']="m/min";
	tpl['result']['units_pow']="kW";	
	tpl['result']['units_vol']="cm^3/min";
	tpl['result']['units_torque']="Nm";
	tpl['result']['units_force']="N";
	unit=25.4; // Convert inch output to metric	
}else{
	tpl['result']['units']="in";
	tpl['result']['units_sfm']="f/min";
	tpl['result']['units_pow']="HP";
	tpl['result']['units_vol']="in^3/min";
	tpl['result']['units_torque']="in-lb";
	tpl['result']['units_force']="lb";
}
tpl['form_error']['error']="0";

tpl['form_post']['tool_ideal_length']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['tool_len'];

tpl['form_post']['tool_ideal_helix']=db.tool_type[tool_id]['helix'];

//check max rpm
if (tpl['form_post']['machine_max_rpm']<=0){
	tpl['form_post']['machine_max_rpm']=10000;
		//tpl['form_error']['maxhine_max_rpm']="Max RPM is 10000 by default";
}
//Check Dia
if(tpl['form_post']['tool_diameter']<=0){
//tpl['form_error']['tool_diameter']="Tool Diameter is required";
}
//Check number of flutes
if (tpl['form_post']['tool_flute_n']==0 ||tpl['form_post']['tool_flute_n']==""){
tpl['form_post']['tool_flute_n']=db.tool_type[tool_id]['flutes'];
}
if (tpl['form_post']['tool_flute_n'] != db.tool_type[tool_id]['flutes'] ){
		tpl['form_error']['tool_flute_n']="Unusual Number of Starts<br>Default number is "+db.tool_type[tool_id]['flutes'];
}

var thread=Calc_Thread_Info(tpl['form_post']['tool_thread_form'],tpl['form_post']['tool_thread_size'],db.tool_type[tool_id]['forming'],0)

if (typeof thread == "undefined" && lic_type!="pro"){
	tpl['form_error']['tool_thread_form']="Please purchase the PRO version";
return;
}

tpl['form_post']['tool_diameter']=thread.MAJOR_Dia;
tpl['form_post']['tool_pitch']=thread.Pitch


if (tpl['form_post']['tap_drill_dia']==0)tpl['form_post']['tap_drill_dia']=thread.Drill_Dia;
/*if (tpl['form_post']['tap_drill_dia']!=thread.Drill_Dia){
	tpl['form_error']['thread_pc']="Recommended thread engagement is "+thread.Thread_PC_Best+"%";
}*/

if (tpl['form_post']['tap_thread_pc']==0)tpl['form_post']['tap_thread_pc']=thread.Thread_PC_Best;
if (tpl['form_post']['tap_thread_pc']!=thread.Thread_PC_Best){
	tpl['form_error']['tap_thread_pc']="Recommended thread engagement is "+thread.Thread_PC_Best+"%";
}

tpl['form_post']['tap_drill_dia']=Calc_Thread_Drill_Dia(thread,tpl['form_post']['tap_thread_pc']);

//Output Drill table here
var headers=[["number","#","width:16%;"],["fraction","x/y","width:16%;"],["letter","L","width:16%;"],["metric","mm","width:20%;"],["inch","in","width:16%;"],["thread_pc","%","width:16%;"]];
//var headers=["#","x/y","L","mm","in"];

var params={} //declare parameters object for matching!

if (db.tool_type[tool_id]['forming']==1){
params.max_dia = X_Y_Delta(100, 0, thread.MINOR_Dia, thread.MAJOR_Dia, 40) 
}else{
params.max_dia = X_Y_Delta(100, 0, thread.MINOR_Dia, thread.MAJOR_Dia, 50) 
}
params.min_dia = X_Y_Delta(100, 0, thread.MINOR_Dia, thread.MAJOR_Dia, 100) 

//preform a query function on our table!
var drills = DB_Get_Rows_Where(db.threads.drills,function(row,params){if (row.inch>params.min_dia && row.inch<params.max_dia) return true;},params);

//add a column to our table and calculate thread percentage for each row
//drills['thread_pc']={}
var pc1=0;
var pc=0;
var pc_prev=0
var selrow=0
var n=1
for (var row in drills){
	
	pc=round(X_Y_Delta( thread.MINOR_Dia, thread.MAJOR_Dia,100, 0, drills[row]['inch']),0);
	drills[row]['thread_pc']=pc;
	
	
	if (pc <= tpl['form_post']['tap_thread_pc'] && pc1==0){
		pc1=pc;
		selrow=n;
		if (tpl['form_post']['tap_thread_pc']-pc>pc_prev-tpl['form_post']['tap_thread_pc']){
			selrow=n-1;
		}
	}
	
	pc_prev=pc;
	
	n++;
}
if (selrow==0) selrow=n;


draw_Table("tap_drill_table",drills,headers,selrow);




	
if (tpl['form_post']['tool_helix']=="0"){
tpl['form_post']['tool_helix']="0.0";
}
if (tpl['form_post']['tool_helix']==""){
tpl['form_post']['tool_helix']=tpl['form_post']['tool_ideal_helix'];
}
if (tpl['form_post']['tool_helix']<0 ){
tpl['form_post']['tool_helix']=0;
}

if (tpl['form_post']['tool_helix']>60){
tpl['form_post']['tool_helix']=60;
}
// if !len 
if(!tpl['form_post']['tool_length']){
tpl['form_post']['tool_length']=tpl['form_post']['tool_ideal_length'];
//tpl['form_error']['tool_length']="Tool Length is ".tpl['form_post']['tool_length']*unit.tpl['units']."";
}

pilot_size=tpl['form_post']['tool_diameter']*tpl['c_tool_type']['pilot_size'];

if(!tpl['form_post']['tool_rpm_adj']){
tpl['form_post']['tool_rpm_adj']=100;
}
if(!tpl['form_post']['tool_feed_adj']){
tpl['form_post']['tool_feed_adj']=100;
}

//if tool length >regular length then
if(tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length']){
	L_S_Factor=Math.pow(tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length'],2);
}
// Adjust Max RPM according to length of the tool
//Formula from www.cncroutersource.com/critical-speed-calculator.html
//Support type=0.25 Fixed-Free
//Safety factor=2
critical_RPM=(4.76*Math.pow(10,6)*tpl['form_post']['tool_diameter']*0.25)/(2*Math.pow(tpl['form_post']['tool_length'],2));
critical_RPM_adj=1;
if (tpl['form_post']['tool_helix']<0 || tpl['form_post']['tool_helix']>60){
tpl['form_post']['tool_helix']=tpl['form_post']['tool_ideal_helix'];
}
tpl['result']['helix_factor']=1+(Math.sin(deg2rad(tpl['form_post']['tool_helix']))-Math.sin(deg2rad(15)))*.5;
tpl['form_post']['tool_ideal_sfm']=tpl['c_material']['sfm']*tpl['c_tool_type']['sfm']*tpl['c_tool_material']['sfm']*tpl['c_tool_coating']['sfm'];
tpl['form_post']['tool_ideal_ipt']=tpl['form_post']['tool_pitch']
tpl['form_post']['tool_ideal_rpm']=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_ideal_feed']=tpl['form_post']['tool_ideal_rpm']*tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_flute_n'];

//----calculate intermidiate rpm without ovveride
int_r_rpm=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
if (int_r_rpm>critical_RPM){
critical_RPM_adj=critical_RPM/int_r_rpm;
//tpl['form_error']['tool_length']="Reduced RPM";
}

//calculate manually entered speed and feed
var tool_real_sfm=tpl['form_post']['tool_ideal_sfm']*critical_RPM_adj;
var tool_real_rpm=12*tool_real_sfm/tpl['form_post']['tool_diameter']/3.14;
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_sfm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_sfm']/tool_real_sfm*100;
	}
	if (control.name== "tool_real_rpm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_rpm']/tool_real_rpm*100;
	}
}
tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_ideal_sfm']*tpl['form_post']['tool_rpm_adj']*critical_RPM_adj/100;

var tool_real_rpm=12*tpl['form_post']['tool_real_sfm']/tpl['form_post']['tool_diameter']/3.14;
var tool_real_ipt=tpl['form_post']['tool_ideal_ipt'];
var tool_real_feed=tool_real_rpm*tool_real_ipt*tpl['form_post']['tool_flute_n'];
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_feed"){
		tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_ideal_sfm']*tpl['form_post']['tool_real_feed']/tool_real_feed*tpl['form_post']['tool_rpm_adj']/100;
	}
}
tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt'];



///////Here we limis SFM by max machine RPM
rpm=12*tpl['form_post']['tool_real_sfm']/tpl['form_post']['tool_diameter']/3.14;
rpm_d=rpm/tpl['form_post']['machine_max_rpm'];
if (rpm_d>1){
	tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_real_sfm']/rpm_d;
}

tpl['form_post']['tool_real_rpm']=12*tpl['form_post']['tool_real_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_rpm']*tpl['form_post']['tool_real_ipt']*tpl['form_post']['tool_flute_n'];

tpl['result']['tool_real_mrr']=((Math.pow(tpl['form_post']['tool_diameter'],2)*3.14)-(Math.pow(tpl['form_post']['tap_drill_dia'],2)*3.14))*tpl['form_post']['tool_real_feed']/4;
tpl['result']['tool_real_hp']=tpl['result']['tool_real_mrr']*mat_power*2.25;

tpl['result']['tool_real_torque']=tpl['result']['tool_real_hp']*63030/tpl['form_post']['tool_real_rpm']; //result in in-lb

//echo tpl['form_post']['tool_ideal_doc'];
//hss uts=145037 psi

flute_n_tor=(3.14/16)*tpl['c_tool_material']['uts']*.75*Math.pow(tpl['form_post']['tool_diameter']*tpl['c_tool_type']['flute_factor'],3)*.75; // result in in-lb
tpl['result']['tool_normal_torque']=flute_n_tor; // 


}//end of drill


function fs_wizard_calc_endmill(control){
//
var mat_id=tpl['form_post']['material'];
var tool_id=tpl['form_post']['tool_type'];
var tool_mat_id=tpl['form_post']['tool_material'];
var tool_coat_id=tpl['form_post']['tool_coating'];
var mat_power=db['material'][mat_id]['kp'];
if(!tpl['form_post']['units'])tpl['form_post']['units']="in";
tpl['units']=tpl['form_post']['output_units']; // just for esy reding
var unit=1;
var is_slot=false;
tpl['form_post']['tool_ideal_slot_doc']={}
tpl['form_post']['tool_ideal_flute_length']={}
tpl['form_post']['tool_ideal_length']={}
//tpl['form_post']['tool_ideal_helix']={}
tpl['form_post']['tool_ideal_side_doc']={}
tpl['form_post']['tool_ideal_woc']={}
tpl['form_post']['tool_ideal_doc']={}
//tpl['form_post']['tool_ideal_leadangle']={}
 			
if(tpl['units']=="mm"){
	tpl['result']['units_sfm']="m/min";
	tpl['result']['units_vol']="cm^3/min";
	tpl['result']['units_pow']="kW";
	tpl['result']['units_torque']="Nm";
	tpl['result']['units_force']="N";
	
	tpl['result']['units']="mm";
	unit=25.4; // Convert inch output to metric	
}else{
	tpl['result']['units_sfm']="f/min";
	tpl['result']['units_vol']="in^3/min";
	tpl['result']['units_pow']="HP";
	tpl['result']['units_torque']="in-lb";
	tpl['result']['units_force']="lb";
	tpl['result']['units']="in";
}
tpl['form_error']['error']="0";

// calc ideal lenght of a tool
tpl['form_post']['tool_ideal_length']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['tool_len'];

//tpl['form_post']['tool_ideal_length_abs']=db.tool_type[tool_id]['tool_len_abs'];
if(db.tool_type[tool_id]['flute_len']>=0){
	tpl['form_post']['tool_ideal_flute_length']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['flute_len'];
}else{
	tpl['form_post']['tool_ideal_flute_length']=Math.abs(db.tool_type[tool_id]['flute_len']);

}
//tpl['form_post']['tool_ideal_flute_length_abs']=db.tool_type[tool_id]['flute_len_abs'];

tpl['form_post']['tool_ideal_helix']=db.tool_type[tool_id]['helix'];

if (tpl['form_post']['tool_shank_diameter']<=0)tpl['form_post']['tool_shank_diameter']=tpl['form_post']['tool_diameter'];
//ideal Depth of cut acc to dia  ||  flute lenght  && number of inserts
//ideal  Slot depth of Cut
if (tpl['form_post']['tool_flute_n']==0 ||tpl['form_post']['tool_flute_n']==""){
tpl['form_post']['tool_flute_n']=db.tool_type[tool_id]['flutes'];
}
	
	//tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_diameter']/2;
	var flute_divider=1;
	if (tpl['form_post']['tool_flute_n']>4)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==4)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==3)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==2)flute_divider=1;
	if (tpl['form_post']['tool_flute_n']==1)flute_divider=1;
if (db.tool_type[tool_id]['slot_doc']>=0){
	tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['slot_doc']*flute_divider;
}else{
	tpl['form_post']['tool_ideal_slot_doc']=Math.abs(db.tool_type[tool_id]['slot_doc']);
}
if (db.tool_type[tool_id]['side_doc']>=0){
	tpl['form_post']['tool_ideal_side_doc']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['side_doc']*flute_divider;
}else{
	tpl['form_post']['tool_ideal_side_doc']=Math.abs(db.tool_type[tool_id]['side_doc']);
}
tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_diameter']*db.tool_type[tool_id]['side_woc'];

//if we are slotting then:
if(tpl['form_post']['tool_woc']/tpl['form_post']['tool_diameter']>0.85){
	tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_slot_doc'];
	tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_diameter'];
	is_slot=true;

}else{
	tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_side_doc'];
        is_slot=false;
}

//Ideal SFM /ipt
//helix factors
if (tpl['form_post']['tool_helix']==="0"){
tpl['form_post']['tool_helix']=0.0;
}
if (tpl['form_post']['tool_helix']===""){
tpl['form_post']['tool_helix']=db.tool_type[tool_id]['helix'];
}
if (tpl['form_post']['tool_helix']<0 ){
tpl['form_post']['tool_helix']="0.0";
}

if (tpl['form_post']['tool_helix']>70){
tpl['form_post']['tool_helix']=70;
}
//axial angle for lead angle
if (!tpl['form_post']['tool_leadangle']  ||  tpl['form_post']['tool_leadangle']<0 ){
tpl['form_post']['tool_leadangle']=db.tool_type[tool_id]['leadangle'];

}

if (!tpl['form_post']['tool_leadangle'] ===0 || !tpl['form_post']['tool_leadangle'] ===""){
tpl['form_post']['tool_leadangle']=90.0;
}

if (tpl['form_post']['tool_leadangle']<5){
tpl['form_post']['tool_leadangle']=5;
}

if (tpl['form_post']['tool_leadangle']>175){
tpl['form_post']['tool_leadangle']=175;
}



if (!tpl['form_post']['tool_corner_rad']  ||  tpl['form_post']['tool_corner_rad']<0 ){
tpl['form_post']['tool_corner_rad']="0.0";
}
if (tpl['form_post']['tool_corner_rad']>tpl['form_post']['tool_diameter']/2){
tpl['form_post']['tool_corner_rad']=tpl['form_post']['tool_diameter']/2;
}
//tpl['result']['helix_factor']=1+Math.Math.cos(deg2rad(30))-Math.Math.cos(deg2rad(tpl['form_post']['tool_helix']));
tpl['result']['helix_factor']=1+(Math.sin(deg2rad(tpl['form_post']['tool_helix']))-Math.sin(deg2rad(30)))*.5;
if (tpl['result']['helix_factor']>1){
//	tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*tpl['result']['helix_factor'];
 
}

//check max rpm
if (tpl['form_post']['machine_max_rpm']<=0){
	tpl['form_post']['machine_max_rpm']=10000;
		//tpl['form_error']['maxhine_max_rpm']="Max RPM is 10000 by default";
}
//Check Dia
if(tpl['form_post']['tool_diameter']<=0){
tpl['form_error']['tool_diameter']="Tool Diameter is required";
}
//Check number of flutes
if(tpl['form_post']['tool_flute_n']<=0){
tpl['form_error']['tool_flute_n']="Number of Flutes is required";
}

// if !len = ideal len
if(!tpl['form_post']['tool_length']){
tpl['form_post']['tool_length']=(tpl['form_post']['tool_ideal_length']?tpl['form_post']['tool_ideal_length']:tpl['form_post']['tool_ideal_length_abs']);
//tpl['form_error']['tool_length']="Tool Length is ".tpl['form_post']['tool_length']*unit.tpl['units']."";
}
// if ! flute len = ideal flute len
if(!tpl['form_post']['tool_flute_length']){
tpl['form_post']['tool_flute_length']=(tpl['form_post']['tool_ideal_flute_length']?tpl['form_post']['tool_ideal_flute_length']:tpl['form_post']['tool_ideal_flute_length_abs']);
//tpl['form_error']['tool_flute_length']="Flute Length is ".tpl['form_post']['tool_ideal_flute_length']*unit.tpl['units']."";
}
// if  flute len > Len
if(tpl['form_post']['tool_flute_length']>tpl['form_post']['tool_length']){
tpl['form_post']['tool_flute_length']=tpl['form_post']['tool_length'];
tpl['form_error']['tool_flute_length']="Limited to tool length";
}

if(!tpl['form_post']['tool_rpm_adj']){
tpl['form_post']['tool_rpm_adj']=100;
}
if(!tpl['form_post']['tool_feed_adj']){
tpl['form_post']['tool_feed_adj']=100;
}

tid=tpl['form_post']['tool_ideal_doc'];
//if tool length >regular length then
//0.5 is a productivity factor
Prod_Factor=1.0;
if((tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length'])  && is_slot){
	tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length'],2* Prod_Factor)*tpl['result']['helix_factor'];
}
if((tpl['form_post']['tool_length']>tpl['form_post']['tool_ideal_length'])  && !is_slot){
	tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_ideal_woc']*Math.pow(tpl['form_post']['tool_ideal_length']/tpl['form_post']['tool_length'],2*Prod_Factor)*tpl['result']['helix_factor'];
}

//tool shank factor
if (tid>tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_shank_diameter']/tpl['form_post']['tool_diameter'],3)){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*Math.pow(tpl['form_post']['tool_shank_diameter']/tpl['form_post']['tool_diameter'],3);
}else{
tpl['form_post']['tool_ideal_doc']=tid;
}

if ((tpl['form_post']['tool_flute_length'] > tpl['form_post']['tool_ideal_flute_length']) && is_slot){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*(tpl['form_post']['tool_ideal_flute_length']/tpl['form_post']['tool_flute_length']) * 0.8;
}

if (tpl['form_post']['tool_flute_length'] > tpl['form_post']['tool_ideal_flute_length']  && !is_slot){
      tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_ideal_woc']*(tpl['form_post']['tool_ideal_flute_length']/tpl['form_post']['tool_flute_length']) * 0.8;
}




//adjust tool ideal doc acc to material cut
        var mat_doc_adjust = mat_power / 0.8;
        if (mat_doc_adjust < 1 ){ mat_doc_adjust = 1;}
		//'echo mat_doc_adjust;
       tpl['form_post']['tool_ideal_doc'] = tpl['form_post']['tool_ideal_doc'] / mat_doc_adjust;

//-------------------------------- Begin Cut balance here---------------------
tis=tpl['form_post']['tool_ideal_woc']*tpl['form_post']['tool_ideal_doc'];
tool_ideal_doc=tpl['form_post']['tool_ideal_doc'];
tool_ideal_woc=tpl['form_post']['tool_ideal_woc'];

if(tpl['form_post']['tool_doc']){
	//if DOC != ideal when not slotting then reduce WOC
	if(!is_slot  && tpl['form_post']['tool_doc']!=tpl['form_post']['tool_ideal_doc']){
		tpl['form_post']['tool_ideal_woc']=tis/tpl['form_post']['tool_doc'];
	}
}

if(tpl['form_post']['tool_woc']){
	//if WOC != ideal when not slotting then reduce DOC
	if(!is_slot  && tpl['form_post']['tool_woc']!=tpl['form_post']['tool_ideal_woc']){
		tpl['form_post']['tool_ideal_doc']=tis/tpl['form_post']['tool_woc'];
	}
}


//----------------------------------------------------------------------------


// Check if ideal slot DOC > Flute
/*
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_ideal_slot_doc']){
tpl['form_post']['tool_ideal_slot_doc']=tpl['form_post']['tool_flute_length']-.001;
//tpl['form_error']['tool_ideal_slot_doc']="Depth of Cut was limited to Flute Length";
}
*/
// Check if ideal DOC > Flute
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_ideal_doc']){
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_flute_length'];
}

// Check if ideal woc> dia
if(tpl['form_post']['tool_diameter']<tpl['form_post']['tool_ideal_woc']){
tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_diameter'];
}

// Check if real DOC > Flute
if(tpl['form_post']['tool_flute_length']<tpl['form_post']['tool_doc']){
tpl['form_post']['tool_doc']=tpl['form_post']['tool_flute_length'];
//tpl['form_error']['tool_doc']="Depth of Cut=".tpl['form_post']['tool_doc']*unit.tpl['units']."";
}
// Check if WOC > diameter
if(tpl['form_post']['tool_woc']>tpl['form_post']['tool_diameter']){
tpl['form_post']['tool_woc']=tpl['form_post']['tool_diameter'];
//tpl['form_error']['tool_woc']="Width Of Cut=".tpl['form_post']['tool_diameter']*unit.tpl['units']."";
}


// Check if DOC =0
if(!tpl['form_post']['tool_doc']){
tpl['form_post']['tool_doc']=tpl['form_post']['tool_ideal_doc'];
//tpl['form_error']['tool_doc']="Depth of Cut=".tpl['form_post']['tool_ideal_doc']*unit.tpl['units']."";
}
// Check if woc =0
if(!tpl['form_post']['tool_woc']){
tpl['form_post']['tool_woc']=tpl['form_post']['tool_ideal_woc'];
//tpl['form_error']['tool_woc']="Width of Cut=".tpl['form_post']['tool_ideal_woc']*unit.tpl['units']."";
}

// Adjust Max RPM according to length of the tool
//Formula from www.cncroutersource.com/critical-speed-calculator.html
//Support type=0.25 Fixed-Free
//Safety factor=2

var CRPMDIA=(tpl['form_post']['tool_diameter']>=tpl['form_post']['tool_shank_diameter'] ? tpl['form_post']['tool_diameter'] : tpl['form_post']['tool_shank_diameter']);
var critical_RPM=(4.76*Math.pow(10,6)*CRPMDIA*0.25)/(2*Math.pow(tpl['form_post']['tool_length'],2));
var critical_RPM_adj=1;


//Shank Torque factors
//T_Factor=Math.pow(tpl['form_post']['tool_shank_diameter']/tpl['form_post']['tool_diameter'],2);
//if (T_Factor > 1)T_Factor = 1; 
//= 1; 
//effective diameter ED = 2a?s RA?-(R-DOC)A?

if (tpl['form_post']['tool_doc']<tpl['form_post']['tool_corner_rad']){
	tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter']-(2*tpl['form_post']['tool_corner_rad'])+(2*Math.sqrt(Math.pow(tpl['form_post']['tool_corner_rad'],2)-Math.pow(tpl['form_post']['tool_corner_rad']-tpl['form_post']['tool_doc'],2)));
	//real axial chip thinning factors
	tpl['result']['chip_axial_real_thinning_factor']=1/Math.sqrt(1-Math.pow((1-((tpl['form_post']['tool_doc'])/tpl['form_post']['tool_corner_rad'])),2));
	if (tpl['result']['chip_axial_real_thinning_factor']==0)tpl['result']['chip_axial_real_thinning_factor']=1;
	//if (tpl['result']['chip_axial_real_thinning_factor']>10)tpl['result']['chip_axial_real_thinning_factor']=10;
}else{ 
	tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter'];
	//tpl['result']['tool_effective_diameter']=tpl['form_post']['tool_diameter']+(tan(deg2rad(tpl['form_post']['tool_leadangle'])*tpl['form_post']['tool_doc']));

	tpl['result']['chip_axial_real_thinning_factor']=1/Math.sin(deg2rad(tpl['form_post']['tool_leadangle']));
	if (tpl['result']['chip_axial_real_thinning_factor']==0)tpl['result']['chip_axial_real_thinning_factor']=1;
	//if (tpl['result']['chip_axial_real_thinning_factor']>10)tpl['result']['chip_axial_real_thinning_factor']=10;
}
//real radial chip thinning factors

    if(tpl['form_post']['tool_woc']*2<tpl['form_post']['tool_diameter']){
        tpl['result']['chip_radial_real_thinning_factor']=1/Math.sqrt(1-Math.pow((1-((2*tpl['form_post']['tool_woc'])/tpl['result']['tool_effective_diameter'])),2));
        if (tpl['result']['chip_radial_real_thinning_factor']==0)tpl['result']['chip_radial_real_thinning_factor']=1;
        if (tpl['result']['chip_radial_real_thinning_factor']>3)tpl['result']['chip_radial_real_thinning_factor']=3;
    }else{
        tpl['result']['chip_radial_real_thinning_factor']=1;
    }


var HSM_SFM_Factor=1;
if (tpl['form_post']['hsm']==true){
	HSM_SFM_Factor = tpl['result']['chip_radial_real_thinning_factor']*1.5-.5;
    if (HSM_SFM_Factor > 2.5 )HSM_SFM_Factor = 2.5;
}else{
	HSM_SFM_Factor =1
}

if (tpl['form_post']['chip_thinning']==true){
	tpl['result']['chip_real_thinning_factor']=tpl['result']['chip_radial_real_thinning_factor']*tpl['result']['chip_axial_real_thinning_factor'];
}else{
	tpl['result']['chip_real_thinning_factor']=1;
}

//THREADING if we are doing internal Arc then
if (tpl['c_tool_type']['type']=="threadmill"){
	if (tpl['form_post']['thread_major_diameter']==0){
		tpl['form_error']['thread_major_diameter']="Major Diameter Is Required";
	}
	if (tpl['form_post']['thread_major_diameter']<=tpl['form_post']['tool_diameter']  && tpl['form_post']['thread_external']==0 ){
//		tpl['form_error']['thread_major_diameter']="Major Diameter is too small to mill Internal Thread with this tool";
	}
	if (tpl['form_post']['thread_external']==0){
		tpl['result']['chip_real_thinning_factor']=(tpl['form_post']['thread_major_diameter']-tpl['form_post']['tool_diameter'])/tpl['form_post']['thread_major_diameter'];
	}else{
		tpl['result']['chip_real_thinning_factor']=(tpl['form_post']['thread_major_diameter']+tpl['form_post']['tool_diameter'])/tpl['form_post']['thread_major_diameter'];
	}
	
	
}



if (is_slot){HSM_SFM_Factor = 0.8;}

//Ax/rad eng %
/*tpl['tool_ideal_woc_pc']=tpl['form_post']['tool_ideal_woc']/tpl['form_post']['tool_diameter']*100;
tpl['tool_ideal_doc_pc']=tpl['form_post']['tool_ideal_doc']/tpl['form_post']['tool_diameter']*100;
tpl['tool_ideal_slot_doc_pc']=tpl['form_post']['tool_ideal_slot_doc']/tpl['form_post']['tool_diameter']*100;
*/
//Ax/rad eng %
tpl['result']['tool_woc_pc']={}
tpl['result']['tool_woc_pc']=tpl['form_post']['tool_woc']/tpl['form_post']['tool_diameter']*100;
tpl['result']['tool_doc_pc']={}
tpl['result']['tool_doc_pc']=tpl['form_post']['tool_doc']/tpl['form_post']['tool_diameter']*100;



tool_flute_chipload_dec = (tpl['tool_chipload']* tpl['form_post']['tool_flute_n']* 5 / 100);
        if (tool_flute_chipload_dec > tpl['tool_chipload'] / 2 )tool_flute_chipload_dec = tpl['tool_chipload']/ 2;
       
tpl['form_post']['tool_ideal_sfm']=tpl['c_material']['sfm']*tpl['c_tool_type']['sfm']*tpl['c_tool_material']['sfm']*tpl['c_tool_coating']['sfm']*HSM_SFM_Factor;

tpl['form_post']['tool_ideal_ipt']=(tpl['tool_chipload']-tool_flute_chipload_dec)*tpl['c_material']['ipt']*tpl['c_tool_material']['ipt']*tpl['result']['helix_factor']*tpl['c_tool_type']['ipt']/tpl['tool_05_chipload'];
tpl['form_post']['tool_ideal_rpm']=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
tpl['form_post']['tool_ideal_feed']=tpl['form_post']['tool_ideal_rpm']*tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_flute_n'];


ttrig = (tpl['form_post']['tool_length']/tpl['form_post']['tool_ideal_length']);
tpl['form_post']['tool_doc_factor']=tpl['form_post']['tool_doc']/tool_ideal_doc;
tpl['form_post']['tool_woc_factor']=tpl['form_post']['tool_woc']/tool_ideal_woc;


//if we are slotting then:
if(is_slot){
   tpl['form_post']['tool_woc_factor']=1;

}
tpl['form_post']['tool_load_factor']=tpl['form_post']['tool_doc_factor']*tpl['form_post']['tool_woc_factor'];


tpl['form_post']['tool_load_feed_factor']=1/tpl['form_post']['tool_load_factor'];

// Limit load factors
//if len/load/feed is >100% then we limit it
max_f_increase=1/mat_power*1.5;
if (max_f_increase>1.5)max_f_increase=1.5;
/*if (tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_radial_real_thinning_factor']*tpl['result']['chip_axial_real_thinning_factor']>max_f_increase){
	tpl['form_post']['tool_load_feed_factor']=max_f_increase/(tpl['result']['chip_radial_real_thinning_factor']*tpl['result']['chip_axial_real_thinning_factor']);
	tpl['form_error']['tool_load_feed_factor']="Tip: increase material load";
}*/
if (tpl['form_post']['tool_load_feed_factor']>max_f_increase){
	tpl['form_post']['tool_load_feed_factor']=max_f_increase;
	tpl['form_error']['tool_load_feed_factor']="Tip: increase material load";
}
if (tpl['form_post']['tool_load_feed_factor']<0.5){
	tpl['form_post']['tool_load_feed_factor']=0.5;
}

//tpl['form_post']['tool_load_feed_factor']=1;// ahh fuck it1111111111111111
//----calculate intermidiate rpm without ovveride
int_r_rpm=12*tpl['form_post']['tool_ideal_sfm']/tpl['form_post']['tool_diameter']/3.14;
if (int_r_rpm>critical_RPM){
critical_RPM_adj=critical_RPM/int_r_rpm;
tpl['form_error']['tool_length']="Reduced RPM";
}

//calculate manually entered speed and feed
var tool_real_sfm=tpl['form_post']['tool_ideal_sfm']*critical_RPM_adj;
var tool_real_rpm=12*tool_real_sfm/tpl['result']['tool_effective_diameter']/3.14;
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_sfm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_sfm']/tool_real_sfm*100;
	}
	if (control.name== "tool_real_rpm"){
		tpl['form_post']['tool_rpm_adj']=tpl['form_post']['tool_real_rpm']/tool_real_rpm*100;
	}
}
tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_ideal_sfm']*tpl['form_post']['tool_rpm_adj']*critical_RPM_adj/100;
var tool_real_rpm=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
var tool_real_ipt=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor'];
var tool_real_feed=tool_real_rpm*tool_real_ipt*tpl['form_post']['tool_flute_n'];
if (typeof (control) !== "undefined"){
	if (control.name== "tool_real_ipt"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_ipt']/tool_real_ipt*100;
	}
	if (control.name== "tool_real_feed"){
		tpl['form_post']['tool_feed_adj']=tpl['form_post']['tool_real_feed']/tool_real_feed*100;
	}
}
tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt']*tpl['form_post']['tool_load_feed_factor']*tpl['result']['chip_real_thinning_factor']*tpl['form_post']['tool_feed_adj']/100;



///////Here we limis SFM by max machine RPM
rpm=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
rpm_d=rpm/tpl['form_post']['machine_max_rpm'];
if (rpm_d>1){
	tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_real_sfm']/rpm_d;
	tpl['form_error']['tool_real_rpm']="RPM Limited by MAX machine spindle speed";

}

//////////////
/*if (tpl['form_post']['tool_real_ipt']/tpl['form_post']['tool_ideal_ipt']>1.5){
	tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_ideal_ipt']*1.5;
	tpl['form_error']['tool_real_ipt']="Chip Load was limited to 150%";
	}
*/
//avg chip=(360*chipload*with_o_cut)/(3.14*Diam*Eng_angle)*Math.sin(deg2rad(90-helixang))
//KC11=
//tpl['tool_real_avg_chip']=;

tpl['result']['chip_real_thickness']=tpl['form_post']['tool_real_ipt']/tpl['result']['chip_real_thinning_factor'];


tpl['form_post']['tool_real_rpm']=12*tpl['form_post']['tool_real_sfm']/tpl['result']['tool_effective_diameter']/3.14;
tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_rpm']*tpl['form_post']['tool_real_ipt']*tpl['form_post']['tool_flute_n'];

tpl['result']['tool_real_mrr']=tpl['form_post']['tool_doc']*tpl['form_post']['tool_woc']*tpl['form_post']['tool_real_feed'];
tpl['result']['tool_real_hp']=tpl['result']['tool_real_mrr']*mat_power/tpl['result']['helix_factor'];
//I = pi x d^4 / 64 
tpl['result']['tool_real_torque']=tpl['result']['tool_real_hp']*63030/tpl['form_post']['tool_real_rpm'];
tpl['result']['tool_real_force']=tpl['result']['tool_real_torque']/tpl['result']['tool_effective_diameter']*2;
//f=(FL^3)/(3EI)


/*tpl['result']['tool_real_deviation']=
	fs_wizard_deflection_simple(
		tpl['form_post']['tool_length'],
		tpl['form_post']['tool_flute_length'],
		tpl['form_post']['tool_flute_n'],
		tpl['form_post']['tool_diameter'],
		tpl['form_post']['tool_shank_diameter'],
		tpl['result']['tool_real_force'],
		tpl['tool_material'][tool_mat_id]['rigid']
	);


//echo tpl['form_post']['tool_ideal_doc'];
tpl['result']['shank_max_deviation']=(tpl['c_tool_material']['dev_max']/tpl['form_post']['tool_diameter'])*(tpl['form_post']['tool_length']-tpl['form_post']['tool_flute_length']);
tpl['result']['flute_max_deviation']=(tpl['c_tool_material']['dev_max']/tpl['form_post']['tool_diameter'])*(tpl['form_post']['tool_flute_length'])*2;

tpl['result']['tool_woc_deg']=fs_wizard_calc_eng_angle(tpl['result']['tool_effective_diameter'],tpl['form_post']['tool_woc']);
//tpl['result']['tool_max_deviation']=tpl['result']['flute_max_deviation']+tpl['result']['shank_max_deviation'];

tpl['result']['tool_max_deviation']=(tpl['c_tool_material']['dev_max']/tpl['form_post']['tool_diameter'])*(tpl['form_post']['tool_length'])/5;

//hss uts=145037 psi
//plastic deformation =.58
//safety factor=.5
*/
shank_n_tor=(3.14/16)*tpl['c_tool_material']['uts']*.58*Math.pow(tpl['form_post']['tool_shank_diameter'],3)*.5/12;
flute_n_tor=(3.14/16)*tpl['c_tool_material']['uts']*.58*Math.pow(tpl['form_post']['tool_diameter'],3)*.5/12;
if (flute_n_tor<shank_n_tor){
		tpl['result']['tool_normal_torque']=flute_n_tor;
	}else{
		tpl['result']['tool_normal_torque']=shank_n_tor;
	}
if(tpl['result']['tool_max_deviation']>tpl['result']['tool_real_deviation']*.9){
		form_error['tool_real_deviation']="Tool is close to break pont";
	}
//tpl['result']['tool_max_torque']=(3.14/16)*90000*.58*Math.pow(tpl['form_post']['tool_shank_diameter'],3)/12;

//fl_STR=0.2*tpl['form_post']['tool_flute_n'];
//if (fl_STR>1)fl_STR=1;
//tpl['result']['tool_flute_max_torque']=(3.14/16)*90000*.58*Math.pow(tpl['form_post']['tool_diameter'],3)*fl_STR/12;


if (tpl['form_post']['tool_real_rpm']>tpl['form_post']['machine_max_rpm']){
	tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_feed']*tpl['form_post']['machine_max_rpm']/tpl['form_post']['tool_real_rpm'];
	tpl['form_post']['tool_real_rpm']=tpl['form_post']['machine_max_rpm'];
		//tpl['form_error']['tool_real_rpm']="RPM Limited by MAX machine spindle speed";

}

}
function reset_tool_form_data(){
//only reset tool  data is major tool type was changed
if (db.tool_type[document.getElementById("tool_type").value]['type'] !==tpl['c_tool_type']['type']){
	document.getElementById("form_post_tool_shank_diameter").value=""
	document.getElementById("form_post_tool_length").value=""
	document.getElementById("form_post_tool_flute_length").value=""
	document.getElementById("form_post_tool_flute_n").value=""
	document.getElementById("form_post_tool_length").value=""
	document.getElementById("form_post_tool_helix").value=""
	document.getElementById("form_post_tool_leadangle").value=""
	document.getElementById("form_post_tool_corner_rad").value=""
}

}
function tpl2form(){

document.getElementById("material").value=tpl['form_post']['material']
document.getElementById("c_material_hb").innerHTML=tpl['c_material']['hb'];
document.getElementById("input_units").value=tpl['form_post']['input_units']
document.getElementById("output_units").value=tpl['form_post']['output_units']
//document.getElementById("input_units").value=tpl['form_post']['current_input_units']

editElementByName("current_input_units","innerHTML",tpl['form_post']['current_input_units'])
editElementByName("result_units","innerHTML",tpl['result']['units'])


document.getElementById("tool_type").value=tpl['form_post']['tool_type']
document.getElementById("tool_material").value=tpl['form_post']['tool_material']
document.getElementById("tool_coating").value=tpl['form_post']['tool_coating']

document.getElementById("form_post_machine_max_rpm").value=tpl['form_post']['machine_max_rpm']

document.getElementById("form_post_tool_diameter").value=round(tpl['form_post']['tool_diameter'],3)
document.getElementById("form_post_tool_shank_diameter").value=round(tpl['form_post']['tool_shank_diameter'],3)

document.getElementById("form_post_tool_length").value=round(tpl['form_post']['tool_length'],3)
document.getElementById("form_post_tool_flute_length").value=round(tpl['form_post']['tool_flute_length'],3)
document.getElementById("form_post_tool_flute_n").value=tpl['form_post']['tool_flute_n']
document.getElementById("form_post_tool_length").value=round(tpl['form_post']['tool_length'],3)
document.getElementById("form_post_tool_doc").value=round(tpl['form_post']['tool_doc'],3)
document.getElementById("form_post_tool_woc").value=round(tpl['form_post']['tool_woc'],3)


document.getElementById("form_post_thread_major_diameter").value=tpl['form_post']['thread_major_diameter']
document.getElementById("form_post_thread_external").checked=tpl['form_post']['thread_external']
document.getElementById("form_post_thread_internal").checked= !tpl['form_post']['thread_external']

document.getElementById("form_post_tool_helix").value=round(tpl['form_post']['tool_helix'],3)
document.getElementById("form_post_tool_leadangle").value=round(tpl['form_post']['tool_leadangle'],3)
document.getElementById("form_post_tool_corner_rad").value=round(tpl['form_post']['tool_corner_rad'],3)


document.getElementById("form_post_tool_rpm_adj").value=tpl['form_post']['tool_rpm_adj']
document.getElementById("form_post_tool_feed_adj").value=tpl['form_post']['tool_feed_adj']

if (round(tpl['form_post']['tool_rpm_adj']/10,0)==tpl['form_post']['tool_rpm_adj']/10){
document.getElementById("tool_rpm_adj").value=tpl['form_post']['tool_rpm_adj'];
}else{
document.getElementById("tool_rpm_adj_manual").value=round(tpl['form_post']['tool_rpm_adj'],0);
document.getElementById("tool_rpm_adj").value=round(tpl['form_post']['tool_rpm_adj'],0);
document.getElementById("tool_rpm_adj_manual").innerHTML=round(tpl['form_post']['tool_rpm_adj'],0);
}

if (round(tpl['form_post']['tool_feed_adj']/10,0)==tpl['form_post']['tool_feed_adj']/10){
document.getElementById("tool_feed_adj").value=tpl['form_post']['tool_feed_adj'];
}else{
document.getElementById("tool_feed_adj_manual").value=round(tpl['form_post']['tool_feed_adj'],0);
document.getElementById("tool_feed_adj").value=round(tpl['form_post']['tool_feed_adj'],0);
document.getElementById("tool_feed_adj_manual").innerHTML=round(tpl['form_post']['tool_feed_adj'],0);
}

document.getElementById("form_post_hsm").value=round(tpl['form_post']['hsm'],0)
document.getElementById("form_post_tool_real_sfm").value=round(tpl['form_post']['tool_real_sfm'],0)
document.getElementById("form_post_tool_real_rpm").value=round(tpl['form_post']['tool_real_rpm'],0)
document.getElementById("form_post_tool_real_ipt").value=round(tpl['form_post']['tool_real_ipt'],4)
document.getElementById("form_post_tool_real_feed").value=round(tpl['form_post']['tool_real_feed'],2)


/////////////////////Update various labels///////////////////////
document.getElementById("header_circle_side").innerHTML=(tpl['form_post']['thread_external'] ? "OD" : "ID")
document.getElementById("header_thread_major_diameter").innerHTML=tpl['form_post']['thread_major_diameter']


document.getElementById("header_tool_real_rpm").innerHTML=round(tpl['form_post']['tool_real_rpm'],0)
document.getElementById("header_tool_real_feed").innerHTML=round(tpl['form_post']['tool_real_feed'],2)
document.getElementById("header_tool_real_sfm").innerHTML=round(tpl['form_post']['tool_real_sfm'],0)
document.getElementById("header_tool_real_ipt").innerHTML=round(tpl['form_post']['tool_real_ipt'],4)

document.getElementById("header_tool_doc").innerHTML=round(tpl['form_post']['tool_doc'],3)
document.getElementById("header_tool_woc").innerHTML=round(tpl['form_post']['tool_woc'],3)

document.getElementById("header_tool_rpm_adj").innerHTML=round(tpl['form_post']['tool_rpm_adj'],0)
document.getElementById("header_tool_feed_adj").innerHTML=round(tpl['form_post']['tool_feed_adj'],0)




document.getElementById("header_machine_max_rpm").innerHTML=round(tpl['form_post']['machine_max_rpm'],0)

document.getElementById("header_tool_diameter").innerHTML=round(tpl['form_post']['tool_diameter'],3)
document.getElementById("header_tool_flute_n").innerHTML=round(tpl['form_post']['tool_flute_n'],0)
document.getElementById("header_tool_short_name").innerHTML=tpl['c_tool_type']['short_name'];




document.getElementById("result_tool_real_mrr").innerHTML=round(tpl['result']['tool_real_mrr'],2);
editElementByName("result_units_vol","innerHTML",tpl['result']['units_vol']);
document.getElementById("result_tool_real_hp").innerHTML=round(tpl['result']['tool_real_hp'],2);
document.getElementById("result_tool_real_torque").innerHTML=round(tpl['result']['tool_real_torque'],2);
document.getElementById("result_tool_real_force").innerHTML=round(tpl['result']['tool_real_force'],2);

document.getElementById("result_tool_effective_diameter").innerHTML=round(tpl['result']['tool_effective_diameter'],3);
document.getElementById("result_chip_real_thickness").innerHTML=round(tpl['result']['chip_real_thickness'],3);


editElementByName("result_units_sfm","innerHTML",tpl['result']['units_sfm']);
editElementByName("result_units_pow","innerHTML",tpl['result']['units_pow']);

editElementByName("result_units_force","innerHTML",tpl['result']['units_force']);

editElementByName("result_units_torque","innerHTML",tpl['result']['units_torque']);
document.getElementById("result_tool_normal_torque").innerHTML=round(tpl['result']['tool_normal_torque'],2);




//update_by_name()

if (tpl['form_post']['tool_length']==tpl['form_post']['tool_ideal_length']){
	document.getElementById("form_post_tool_length").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_flute_length']==tpl['form_post']['tool_ideal_flute_length']){
	document.getElementById("form_post_tool_flute_length").style.backgroundColor="yellow";
}

if (tpl['form_post']['tool_real_sfm']==tpl['form_post']['tool_ideal_sfm']){
	document.getElementById("form_post_tool_real_sfm").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_real_ipt']==tpl['form_post']['tool_ideal_ipt']){
	document.getElementById("form_post_tool_real_ipt").style.backgroundColor="yellow";
}
if (db.tool_type[tool_id]['helix']==tpl['form_post']['tool_helix']){
	document.getElementById("form_post_tool_helix").style.backgroundColor="yellow";
}
if (db.tool_type[tool_id]['leadangle']==tpl['form_post']['tool_leadangle']){
	document.getElementById("form_post_tool_leadangle").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_diameter']==tpl['form_post']['tool_shank_diameter']){
	document.getElementById("form_post_tool_shank_diameter").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_doc']==tpl['form_post']['tool_ideal_doc']){
	document.getElementById("form_post_tool_doc").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_woc']==tpl['form_post']['tool_ideal_woc']){
	document.getElementById("form_post_tool_woc").style.backgroundColor="yellow";
}


}
function calc_fswizard(self,direct_load){

current_parent="panel_fswizard";
if (calc_run==false) return;
if (direct_load!=true){
//if we are loading calculation, then simply dont get any data from our fields!
	tpl['form_post']['tool_type']={}; 
	tpl['form_post']['units']={};
	tpl['units']={};
	tpl['form_post']['input_units']={};
	tpl['form_post']['output_units']={};
	tpl['form_post']['material']={};
	tpl['form_post']['tool_type']={};
	tpl['form_post']['tool_material']={};
	tpl['form_post']['tool_coating']={};
	tpl['form_post']['machine_type']={};
	tpl['form_post']['machine_max_rpm']={};
	tpl['form_post']['machine_max_feed']={};
	tpl['form_post']['machine_max_hp']={};
	tpl['form_post']['tool_diameter']={};
	tpl['form_post']['tool_pitch']={};
	tpl['form_post']['tool_shank_diameter']={};
	tpl['form_post']['tool_length']={};

	tpl['form_post']['tool_flute_length']={};
	tpl['form_post']['tool_flute_n']={};

	tpl['form_post']['tool_length']={};
	tpl['form_post']['tool_doc']={};
	tpl['form_post']['tool_woc']={};

	// for thread milling
	tpl['form_post']['tool_depth']={};
	tpl['form_post']['thread_major_diameter']={};
	tpl['form_post']['thread_external']={};

	tpl['form_post']['tool_helix']={};
	tpl['form_post']['tool_leadangle']={};
	tpl['form_post']['tool_corner_rad']={};
	tpl['form_post']['tool_rpm_adj']={};
	tpl['form_post']['tool_feed_adj']={};
	tpl['form_post']['hsm']={};
	tpl['form_post']['chip_thinning']={};

	var unit=1;
	var out_unit=1;

	var sfm_unit=1;
	if(document.getElementById("input_units").value=="mm" && tpl.form_post.current_input_units =="in"){
		//Do nothing: values will be converted AFTER calculation
		//unit=1/25.4; // Convert metric input to native inch 
	}
	if(document.getElementById("input_units").value=="mm" && tpl.form_post.current_input_units =="mm"){
		// Convert metric input to native inch 
		unit=1/25.4;
	}
	if(document.getElementById("input_units").value=="in" && tpl.form_post.current_input_units =="mm"){
		// Convert metric input to native inch 
		unit=1/25.4;
	}
	if(document.getElementById("output_units").value=="mm" && tpl.form_post.current_output_units =="mm"){
		// Convert metric input to native inch 
		out_unit=1/25.4;
		sfm_unit=1/0.3048
	}
	if(document.getElementById("output_units").value=="in" && tpl.form_post.current_output_units =="mm"){
		// Convert metric input to native inch 
		out_unit=1/25.4;
		sfm_unit=1/0.3048
	}


	/*if(document.getElementById("input_units").value=="in" && tpl.form_post.current_input_units=="mm"){
		unit=1/25.4; // Convert metric input to native inch 
	}
	*/
	tpl['form_post']['material']=document.getElementById("material").value;

	tpl['form_post']['input_units']=document.getElementById("input_units").value;
	tpl['form_post']['output_units']=document.getElementById("output_units").value;
	tpl['form_post']['current_input_units']=document.getElementById("input_units").value;
	tpl['form_post']['current_output_units']=document.getElementById("output_units").value;

	tpl['form_post']['tool_type']=document.getElementById("tool_type").value;
	tpl['form_post']['tool_material']=document.getElementById("tool_material").value;
	tpl['form_post']['tool_coating']=document.getElementById("tool_coating").value;

	tpl['form_post']['tool_thread_form']=document.getElementById("tool_thread_form").value;
	tpl['form_post']['tool_thread_size']=document.getElementById("tool_thread_size").value;

	tpl['form_post']['machine_max_rpm']=document.getElementById("form_post_machine_max_rpm").value;
	/*tpl['form_post']['machine_max_feed']=document.getElementById("machine_max_feed").value;
	tpl['form_post']['machine_max_hp']=document.getElementById("machine_max_hp").value;
	*/
	tpl['form_post']['tool_diameter']=document.getElementById("form_post_tool_diameter").value*unit;
	tpl['form_post']['tool_pitch']=document.getElementById("form_post_tool_pitch").value*unit;
	tpl['form_post']['tap_thread_pc']=document.getElementById("form_post_thread_pc").value
	tpl['form_post']['tap_drill_dia']=document.getElementById("form_post_tap_drill_dia").value*unit;
	
	tpl['form_post']['tool_shank_diameter']=document.getElementById("form_post_tool_shank_diameter").value*unit;
	tpl['form_post']['tool_length']=document.getElementById("form_post_tool_length").value*unit;
	tpl['form_post']['tool_flute_length']=document.getElementById("form_post_tool_flute_length").value*unit;
	tpl['form_post']['tool_flute_n']=document.getElementById("form_post_tool_flute_n").value;
	tpl['form_post']['tool_length']=document.getElementById("form_post_tool_length").value*unit;
	tpl['form_post']['tool_doc']=document.getElementById("form_post_tool_doc").value*unit;
	tpl['form_post']['tool_woc']=document.getElementById("form_post_tool_woc").value*unit;

	tpl['form_post']['tool_real_sfm']=document.getElementById("form_post_tool_real_sfm").value*sfm_unit;
	tpl['form_post']['tool_real_ipt']=document.getElementById("form_post_tool_real_ipt").value*out_unit;
	tpl['form_post']['tool_real_rpm']=document.getElementById("form_post_tool_real_rpm").value;
	tpl['form_post']['tool_real_feed']=document.getElementById("form_post_tool_real_feed").value*out_unit;


	tpl['form_post']['thread_major_diameter']=document.getElementById("form_post_thread_major_diameter").value*unit;
	tpl['form_post']['thread_external']=document.getElementById("form_post_thread_external").checked;

	tpl['form_post']['tool_helix']=document.getElementById("form_post_tool_helix").value;
	tpl['form_post']['tool_leadangle']=document.getElementById("form_post_tool_leadangle").value;
	tpl['form_post']['tool_corner_rad']=document.getElementById("form_post_tool_corner_rad").value*unit;
	tpl['form_post']['tool_rpm_adj']=document.getElementById("form_post_tool_rpm_adj").value;
	tpl['form_post']['tool_feed_adj']=document.getElementById("form_post_tool_feed_adj").value;
	tpl['form_post']['hsm']=document.getElementById("form_post_hsm").checked;
	tpl['form_post']['chip_thinning']=document.getElementById("form_post_chip_thinning").checked;
		
	tpl['c_tool_type']={}
	tpl['c_material']={}
	tpl['c_tool_material']={}
	tpl['c_tool_coating']={}
	//var tpl['c_tool_type']['type']

	tpl['c_material']=db.material[tpl['form_post']['material']];
	tpl['c_tool_type']=db.tool_type[tpl['form_post']['tool_type']];
	tpl['c_tool_material']=db.tool_material[tpl['form_post']['tool_material']];
	tpl['c_tool_coating']=db.tool_coating[tpl['form_post']['tool_coating']];
// end if NOT direct_load
}else{
// if tpl is loaded directrly then...
}
	


// Clear error messages here
tpl['form_error']['tool_flute_n']="";



var mat_id=tpl['form_post']['material'];
var tool_id=tpl['form_post']['tool_type'];
var tool_mat_id=tpl['form_post']['tool_material'];
var tool_coat_id=tpl['form_post']['tool_coating'];


//---------Get chipload for this diameter/tool combination
var dia=tpl['form_post']['tool_diameter'];
var td =0;
var dia1=-1;
var dia2=-1;
var cl1=-1;
var cl2=-1;

// look for larger one
for (var key in db.chipload){
	if (db.chipload[key]["tool_type"]==tpl['c_tool_type']['type']){
		//if tool dia < than found_dia
		if (dia<=db.chipload[key]["dia"]){
			//if found_dia < bigger dia and bigger dia <> 0
			if (dia2>db.chipload[key]["dia"] || dia2==-1){
				dia2=db.chipload[key]["dia"];
				cl2=db.chipload[key]["ipt"]
			}	
		} 
	
	}
}
//Look for smaller one
for (var key in db.chipload){
	if (db.chipload[key]["tool_type"]==tpl['c_tool_type']['type']){
		//if tool dia > than found_dia
		if (dia>=db.chipload[key]["dia"]){
			//
			if (dia1<db.chipload[key]["dia"] || dia2==-1){
				dia1=db.chipload[key]["dia"];
				cl1=db.chipload[key]["ipt"]
			}	
		} 
	
	}
}

tpl['tool_chipload']=X_Y_Delta(dia1,dia2,cl1,cl2,dia);

// find chipload with 0.5" dia
for (var key in db.chipload){
	if (db.chipload[key]["tool_type"]==tpl['c_tool_type']['type'] && db.chipload[key]["dia"]=="0.5"){
		tpl['tool_05_chipload']=db.chipload[key]["ipt"];
	}
}



///////////////////////////////////////////
/////////////Hide all tooling specific blocks////
editStyleByName("section&_endmill","display","none")
editStyleByName("section&_turn","display","none")
editStyleByName("section&_drill","display","none")
editStyleByName("section&_threadmill","display","none")
editStyleByName("section&_ream","display","none")
editStyleByName("section&_tap","display","none")
///////////////////////////////////////////


if (tpl['c_tool_type']["type"]=="endmill"){
	fs_wizard_calc_endmill(self);
	editStyleByName("section&_endmill","display","")
}

if (tpl['c_tool_type']["type"]=="threadmill"){
	fs_wizard_calc_endmill(self);
	editStyleByName("section&_threadmill","display","")
}

if (tpl['c_tool_type']["type"]=="drill"){
	fs_wizard_calc_drill(self);
	editStyleByName("section&_drill","display","")
}
if (tpl['c_tool_type']["type"]=="ream"){
	fs_wizard_calc_drill(self);
	editStyleByName("section&_ream","display","")
}
if (tpl['c_tool_type']["type"]=="turn"){
	fs_wizard_calc_turn(self);
	editStyleByName("section&_turn","display","")
}
if (tpl['c_tool_type']["type"]=="tap"){
	fs_wizard_calc_tap(self);
	editStyleByName("section&_tap","display","")
}

//save complete calc state BEFORE units are converted BACK to damned metric!!!!!!
fs_wizard_save_state();

//////////////////////////////////convert input.output to mm if needed
if (tpl['form_post']['output_units']=="mm"){
	fs_wizard_output_in2mm();
}

if (tpl['form_post']['input_units']=="mm"){
	fs_wizard_input_in2mm();
}

//
document.getElementById("material").value=tpl['form_post']['material']
document.getElementById("c_material_hb").innerHTML=tpl['c_material']['hb'];
document.getElementById("input_units").value=tpl['form_post']['input_units']
document.getElementById("output_units").value=tpl['form_post']['output_units']

document.getElementById("tool_thread_form").value=tpl['form_post']['tool_thread_form']
//load new option list for thread size
	var found =[];
//	db.threads.current.threads=DB_Get_Rows_Where(db.threads.threads,function(row){	if (row.form==db.threads.current.form){if (!inArray(row.size,found)){found.push(row.size);return true;}}return false;});
pop_cmb_box('tool_thread_size',DB_Get_Rows_Where(db.threads.threads,function(row){	if (row.form==db.threads.current.form){if (!inArray(row.size,found)){found.push(row.size);return true;}}return false;}),"size","size");

document.getElementById("tool_thread_size").value=tpl['form_post']['tool_thread_size']

//document.getElementById("input_units").value=tpl['form_post']['current_input_units']

editElementByName("current_input_units","innerHTML",tpl['form_post']['current_input_units'])
editElementByName("result_units","innerHTML",tpl['result']['units'])


document.getElementById("tool_type").value=tpl['form_post']['tool_type']
document.getElementById("tool_material").value=tpl['form_post']['tool_material']
document.getElementById("tool_coating").value=tpl['form_post']['tool_coating']

document.getElementById("form_post_machine_max_rpm").value=tpl['form_post']['machine_max_rpm']


document.getElementById("form_post_tool_diameter").value=round(tpl['form_post']['tool_diameter'],3)


document.getElementById("form_post_tool_shank_diameter").value=round(tpl['form_post']['tool_shank_diameter'],3)


document.getElementById("form_post_tool_tap_diameter").value=round(tpl['form_post']['tool_diameter'],3)
document.getElementById("form_post_tool_pitch").value=round(tpl['form_post']['tool_pitch'],4);

document.getElementById("form_post_tap_drill_dia").value=round(tpl['form_post']['tap_drill_dia'],4)
document.getElementById("form_post_thread_pc").value=round(tpl['form_post']['tap_thread_pc'],0)



document.getElementById("form_post_tool_length").value=round(tpl['form_post']['tool_length'],3)
document.getElementById("form_post_tool_flute_length").value=round(tpl['form_post']['tool_flute_length'],3)
document.getElementById("form_post_tool_flute_n").value=tpl['form_post']['tool_flute_n']
document.getElementById("form_post_tool_length").value=round(tpl['form_post']['tool_length'],3)
document.getElementById("form_post_tool_doc").value=round(tpl['form_post']['tool_doc'],3)
document.getElementById("form_post_tool_woc").value=round(tpl['form_post']['tool_woc'],3)


document.getElementById("form_post_thread_major_diameter").value=tpl['form_post']['thread_major_diameter']
document.getElementById("form_post_thread_external").checked=tpl['form_post']['thread_external']
document.getElementById("form_post_thread_internal").checked= !tpl['form_post']['thread_external']

document.getElementById("form_post_tool_helix").value=round(tpl['form_post']['tool_helix'],3)
document.getElementById("form_post_tool_leadangle").value=round(tpl['form_post']['tool_leadangle'],3)
document.getElementById("form_post_tool_corner_rad").value=round(tpl['form_post']['tool_corner_rad'],3)


document.getElementById("form_post_tool_rpm_adj").value=tpl['form_post']['tool_rpm_adj']
document.getElementById("form_post_tool_feed_adj").value=tpl['form_post']['tool_feed_adj']

if (round(tpl['form_post']['tool_rpm_adj']/10,0)==tpl['form_post']['tool_rpm_adj']/10){
document.getElementById("tool_rpm_adj").value=tpl['form_post']['tool_rpm_adj'];
}else{
document.getElementById("tool_rpm_adj_manual").value=round(tpl['form_post']['tool_rpm_adj'],0);
document.getElementById("tool_rpm_adj").value=round(tpl['form_post']['tool_rpm_adj'],0);
document.getElementById("tool_rpm_adj_manual").innerHTML=round(tpl['form_post']['tool_rpm_adj'],0);
}

if (round(tpl['form_post']['tool_feed_adj']/10,0)==tpl['form_post']['tool_feed_adj']/10){
document.getElementById("tool_feed_adj").value=tpl['form_post']['tool_feed_adj'];
}else{
document.getElementById("tool_feed_adj_manual").value=round(tpl['form_post']['tool_feed_adj'],0);
document.getElementById("tool_feed_adj").value=round(tpl['form_post']['tool_feed_adj'],0);
document.getElementById("tool_feed_adj_manual").innerHTML=round(tpl['form_post']['tool_feed_adj'],0);
}

document.getElementById("form_post_hsm").checked = (round(tpl['form_post']['hsm'],0)==1 ? true : false)
    document.getElementById("form_post_chip_thinning").checked = (round(tpl['form_post']['chip_thinning'],0)==1 ? true : false)

document.getElementById("form_post_tool_real_sfm").value=round(tpl['form_post']['tool_real_sfm'],0)
document.getElementById("form_post_tool_real_rpm").value=round(tpl['form_post']['tool_real_rpm'],0)
document.getElementById("form_post_tool_real_ipt").value=round(tpl['form_post']['tool_real_ipt'],4)
document.getElementById("form_post_tool_real_feed").value=round(tpl['form_post']['tool_real_feed'],2)


/////////////////////Update various labels///////////////////////
document.getElementById("header_circle_side").innerHTML=(tpl['form_post']['thread_external'] ? "OD" : "ID")
document.getElementById("header_thread_major_diameter").innerHTML=tpl['form_post']['thread_major_diameter']


document.getElementById("header_tool_real_rpm").innerHTML=round(tpl['form_post']['tool_real_rpm'],0)
document.getElementById("header_tool_real_feed").innerHTML=round(tpl['form_post']['tool_real_feed'],2)
document.getElementById("header_tool_real_sfm").innerHTML=round(tpl['form_post']['tool_real_sfm'],0)
document.getElementById("header_tool_real_ipt").innerHTML=round(tpl['form_post']['tool_real_ipt'],4)

document.getElementById("header_tool_doc").innerHTML=round(tpl['form_post']['tool_doc'],3)
document.getElementById("header_tool_woc").innerHTML=round(tpl['form_post']['tool_woc'],3)

document.getElementById("header_tool_rpm_adj").innerHTML=round(tpl['form_post']['tool_rpm_adj'],0)
document.getElementById("header_tool_feed_adj").innerHTML=round(tpl['form_post']['tool_feed_adj'],0)




document.getElementById("header_machine_max_rpm").innerHTML=round(tpl['form_post']['machine_max_rpm'],0)

if (tpl['c_tool_type']['type']=="tap"){
document.getElementById("header_tool_diameter").innerHTML=tpl['form_post']['tool_thread_size']+" "+tpl['form_post']['tool_thread_form'];
}else{
document.getElementById("header_tool_diameter").innerHTML=round(tpl['form_post']['tool_diameter'],3) +" "+ tpl['form_post']['current_input_units']+" dia"
}
document.getElementById("header_tool_flute_n").innerHTML=round(tpl['form_post']['tool_flute_n'],0)
document.getElementById("header_tool_short_name").innerHTML=tpl['c_tool_type']['name'];

document.getElementById("header_work_material_name").innerHTML=tpl['c_material']['name'];
document.getElementById("header_tool_material_name").innerHTML=tpl['c_tool_material']['name'];
document.getElementById("header_tool_coating_name").innerHTML=(tpl['c_tool_coating']['name']=="None"?"":tpl['c_tool_coating']['name']);

document.getElementById("result_tool_real_mrr").innerHTML=round(tpl['result']['tool_real_mrr'],2);
editElementByName("result_units_vol","innerHTML",tpl['result']['units_vol']);
document.getElementById("result_tool_real_hp").innerHTML=round(tpl['result']['tool_real_hp'],2);
document.getElementById("result_tool_real_torque").innerHTML=round(tpl['result']['tool_real_torque'],2);
document.getElementById("result_tool_real_force").innerHTML=round(tpl['result']['tool_real_force'],2);

document.getElementById("result_tool_effective_diameter").innerHTML=round(tpl['result']['tool_effective_diameter'],3);
document.getElementById("result_chip_real_thickness").innerHTML=round(tpl['result']['chip_real_thickness'],3);

document.getElementById("chip_radial_real_thinning_factor").innerHTML=round(tpl['result']['chip_radial_real_thinning_factor'],3);
document.getElementById("chip_axial_real_thinning_factor").innerHTML=round(tpl['result']['chip_axial_real_thinning_factor'],3);
    document.getElementById("chip_real_thinning_factor").innerHTML=round(tpl['result']['chip_real_thinning_factor'],3);

    document.getElementById("chip_radial_real_thinning_factor_2").innerHTML=round(tpl['result']['chip_radial_real_thinning_factor'],3);
    document.getElementById("chip_axial_real_thinning_factor_2").innerHTML=round(tpl['result']['chip_axial_real_thinning_factor'],3);
    document.getElementById("chip_real_thinning_factor_2").innerHTML=round(tpl['result']['chip_real_thinning_factor'],3);


    editElementByName("result_units_sfm","innerHTML",tpl['result']['units_sfm']);
editElementByName("result_units_pow","innerHTML",tpl['result']['units_pow']);

editElementByName("result_units_force","innerHTML",tpl['result']['units_force']);

editElementByName("result_units_torque","innerHTML",tpl['result']['units_torque']);
document.getElementById("result_tool_normal_torque").innerHTML=round(tpl['result']['tool_normal_torque'],2);

document.getElementById("form_error_tool_flute_n").innerHTML=tpl['form_error']['tool_flute_n'];

document.getElementById("form_error_tap_thread_pc").innerHTML=tpl['form_error']['tap_thread_pc'];
document.getElementById("form_error_tool_thread_form").innerHTML=tpl['form_error']['tool_thread_form'];

//update_by_name()

if (tpl['form_post']['tool_length']==tpl['form_post']['tool_ideal_length']){
	document.getElementById("form_post_tool_length").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_flute_length']==tpl['form_post']['tool_ideal_flute_length']){
	document.getElementById("form_post_tool_flute_length").style.backgroundColor="yellow";
}

if (tpl['form_post']['tool_real_sfm']==tpl['form_post']['tool_ideal_sfm']){
	document.getElementById("form_post_tool_real_sfm").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_real_ipt']==tpl['form_post']['tool_ideal_ipt']){
	document.getElementById("form_post_tool_real_ipt").style.backgroundColor="yellow";
}
if (db.tool_type[tool_id]['helix']==tpl['form_post']['tool_helix']){
	document.getElementById("form_post_tool_helix").style.backgroundColor="yellow";
}
if (db.tool_type[tool_id]['leadangle']==tpl['form_post']['tool_leadangle']){
	document.getElementById("form_post_tool_leadangle").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_diameter']==tpl['form_post']['tool_shank_diameter']){
	document.getElementById("form_post_tool_shank_diameter").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_doc']==tpl['form_post']['tool_ideal_doc']){
	document.getElementById("form_post_tool_doc").style.backgroundColor="yellow";
}
if (tpl['form_post']['tool_woc']==tpl['form_post']['tool_ideal_woc']){
	document.getElementById("form_post_tool_woc").style.backgroundColor="yellow";
}


//reset all for errors
for (var row in tpl['form_error']){	
			tpl['form_error'][row]=""
}
tpl['form_error']['tool_flute_n']="";
tpl['form_error']['tap_thread_pc']="";
tpl['form_error']['tool_thread_form']="";

}// end calc function

function fs_convert(val,f){
val=val*f;
}
function fs_wizard_output_in2mm(){

tpl['form_post']['tool_real_sfm']=tpl['form_post']['tool_real_sfm']*0.3048;
tpl['form_post']['tool_real_ipt']=tpl['form_post']['tool_real_ipt']*25.4;
tpl['form_post']['tool_real_feed']=tpl['form_post']['tool_real_feed']*25.4;
tpl['result']['tool_real_force']=tpl['result']['tool_real_force']*4.44822162825 ;
tpl['result']['tool_real_deviation']=tpl['result']['tool_real_deviation']*25.4 ;
tpl['result']['tool_max_deviation']=tpl['result']['tool_max_deviation']*25.4 ;
tpl['result']['tool_effective_diameter']=tpl['result']['tool_effective_diameter']*25.4 ;
tpl['result']['tool_real_torque']=tpl['result']['tool_real_torque']*0.112985 ;
tpl['result']['tool_normal_torque']=tpl['result']['tool_normal_torque']* 0.112985;
tpl['result']['tool_real_mrr']=tpl['result']['tool_real_mrr']*16.387064 ;
tpl['result']['tool_real_hp']=tpl['result']['tool_real_hp']*0.735 ;
tpl['result']['chip_real_thickness']=tpl['result']['chip_real_thickness']*25.4 ;
}
function fs_wizard_input_in2mm(){
tpl['form_post']['tool_length']=tpl['form_post']['tool_length']*25.4;
tpl['form_post']['tool_flute_length']=tpl['form_post']['tool_flute_length']*25.4;
tpl['form_post']['tool_woc']=tpl['form_post']['tool_woc']*25.4;
tpl['form_post']['tool_doc']=tpl['form_post']['tool_doc']*25.4;
tpl['form_post']['tool_shank_diameter']=tpl['form_post']['tool_shank_diameter']*25.4;
tpl['form_post']['tool_corner_rad']=tpl['form_post']['tool_corner_rad']*25.4;
tpl['form_post']['tool_diameter']=tpl['form_post']['tool_diameter']*25.4;
tpl['form_post']['tool_pitch']=tpl['form_post']['tool_pitch']*25.4;
tpl['form_post']['tap_drill_dia']=tpl['form_post']['tap_drill_dia']*25.4;

tpl['form_post']['tool_ideal_woc']=tpl['form_post']['tool_ideal_woc']*25.4;
tpl['form_post']['tool_ideal_doc']=tpl['form_post']['tool_ideal_doc']*25.4;
tpl['form_post']['tool_ideal_length']=tpl['form_post']['tool_ideal_length']*25.4;
tpl['form_post']['tool_ideal_flute_length']=tpl['form_post']['tool_ideal_flute_length']*25.4;
}

function tool_thread_form_changed(nocalc){
//	tpl['form_post']['tool_thred_form']=document.getElementById("tool_thread_form").value;
//	tpl['form_post']['tool_thred_size']=document.getElementById("tool_thread_size").value;
	db.threads.current=new Object();
	db.threads.current.form=document.getElementById("tool_thread_form").value;
	var found =[];
	db.threads.current.threads=DB_Get_Rows_Where(db.threads.threads,function(row){
	if (row.form==db.threads.current.form){
		//create a list of found values and add only unique ones
		if (!inArray(row.size,found)){
			found.push(row.size);
			return true;
		}
	}
	return false;
	});
	
	pop_cmb_box('tool_thread_size',db.threads.current.threads,"size","size");
}

