var fillet= new Object();
			fillet={
				rnd:0,
				n_size:5,
				canvas_width:400,
				canvas_height:400,
				canvas_x:200,
				canvas_y:200,
				scale_:1,
				scale:1,
				x1:0,
				y1:0,
				x12:0,
				y12:0,
				xt1:0,
				l1:500,
				angle1:0,
				xt2:0,
				x22:10,
				y22:10,
				l2:500,
				angle2:90,
				rad:.50,
				xc:10,
				yc:10,
				lc:0,
				show_locations:1
            };
		
function calc_fillet(){
current_parent="panel_fillet_calc";
editElementByName("clear","innerHTML","");

fillet.scale=parseFloat(Get_Value("fillet_calc_scale"));
fillet.rad=parseFloat(Get_Value("fillet_calc_rad"));
fillet.angle1=parseFloat(Get_Value("fillet_calc_angle1"));
fillet.angle2=parseFloat(Get_Value("fillet_calc_angle2"));
fillet.x1=parseFloat(Get_Value("fillet_calc_x1"));
fillet.y1=parseFloat(Get_Value("fillet_calc_y1"));

fillet.show_locations=document.getElementById("fillet_show_locations").checked;

fillet.rnd=parseFloat(Get_Value("fillet_calc_round"));

if (fillet.rad<=0) {editElementById("error_fillet_calc_rad","innerHTML","Radius must be bigger than 0");return;}

if (lic_type!="pro" && fillet.rad > 10 ){
	editElementById("error_fillet_calc_rad","innerHTML","Please buy PRO version to unlock");
	fillet.rad=10
}
if (lic_type!="pro" && fillet.rnd > 2 ){
	editElementById("error_fillet_calc_round","innerHTML","Please buy PRO version to unlock");
	fillet.rnd=2
}
if (fillet.angle2 - fillet.angle1>=180) {editElementById("error_fillet_calc_angle2","innerHTML","Angle between line1 and line 2 can not be bigger than 180deg");return;}
if (fillet.angle2 - fillet.angle1<=0) {editElementById("error_fillet_calc_angle2","innerHTML","Angle 2 must be bigger than Angle 1");return;}

fillet_draw();
//display results here


editElementById("fillet_calc_scale","value",fillet.scale);
editElementById("fillet_calc_round","value",fillet.rnd);

editElementById("result_fillet_calc_cc_x","innerHTML",round(fillet.xc,fillet.rnd));
editElementById("result_fillet_calc_cc_y","innerHTML",round(fillet.yc,fillet.rnd));
editElementById("result_fillet_calc_tp1_x","innerHTML",round(fillet.xt1,fillet.rnd));
editElementById("result_fillet_calc_tp1_y","innerHTML",round(fillet.yt1,fillet.rnd));

editElementById("result_fillet_calc_tp2_x","innerHTML",round(fillet.xt2,fillet.rnd));
editElementById("result_fillet_calc_tp2_y","innerHTML",round(fillet.yt2,fillet.rnd));

	try{
		localStorage.setItem('fillet_calc_last_state', JSON.stringify(fillet));
	}catch(e){return}

}
function fillet_bbox(what){
var b={width:0,height:0,x:0,y:0}
b.x=fillet.x1+b.width/2;
b.y=fillet.y1+b.height/2;

b.width=Math.abs(fillet.xc)+Math.abs(fillet.rad)+Math.abs(fillet.x1);
b.height=Math.abs(fillet.yc)+Math.abs(fillet.rad)+Math.abs(fillet.y1);

if (fillet.xc+fillet.rad>=fillet.x1 && fillet.xc-fillet.rad<=fillet.x1){
	b.width=Math.abs(fillet.rad)*2;
	b.x=fillet.xc;
}

if (fillet.yc+fillet.rad>=fillet.y1 && fillet.yc-fillet.rad<=fillet.y1){
	b.height=Math.abs(fillet.rad)*2;
	b.y=fillet.yc;
}

if (fillet.xc+fillet.rad<=fillet.x1){
	b.width=fillet.x1-fillet.xc+fillet.rad;
	b.x=fillet.x1-b.width/2;
}

if (fillet.xc-fillet.rad>=fillet.x1){
	b.width=fillet.xc+fillet.rad-fillet.x1;
	b.x=fillet.x1+b.width/2;
}
if (fillet.yc+fillet.rad<=fillet.y1){
	b.height=fillet.y1-fillet.yc+fillet.rad;
	b.y=fillet.y1-b.height/2;
}
if (fillet.yc-fillet.rad>=fillet.y1){
	b.height=fillet.yc+fillet.rad-fillet.y1;
	b.y=fillet.y1+b.height/2;
}



if (fillet.yc+fillet.rad<=fillet.y1){
b.y=fillet.y1-b.height/2;
}

if (fillet.yc-fillet.rad>=fillet.y1){
b.y=fillet.y1+b.height/2;
}



return b[what];


}

function draw_point(g,xc,yc,n_size){
	g.drawEllipse(xc-n_size, yc-n_size, n_size*2, n_size*2); //Draw circle Center
	g.fillArc(xc-n_size, yc-n_size, n_size*2, n_size*2, 0, 90);
	g.fillArc(xc-n_size, yc-n_size, n_size*2, n_size*2, 180, 270);
}

function fillet_draw()
{
var f_=fillet;

 var angle1=deg2rad(f_.angle1);
 var angle2=deg2rad(f_.angle2);
 
var w=viewport().width*fillet.scale*0.5;//getOffset("").height;
var h=viewport().height*fillet.scale*0.5;
		
fillet.canvas_width=(w > h ? h : w)
fillet.canvas_height=fillet.canvas_width;

editStyleById("fillet_calc_canvas","width",fillet.canvas_width+"px");
editStyleById("fillet_calc_canvas","height",fillet.canvas_height+"px");

 
 //calculate center offsets as if f_.angle1 is zero
 var xct=f_.rad/Math.tan((angle2-angle1)/2);
 var yct=f_.rad;
 //get length of hyppotenuse
 f_.lc=f_.rad/Math.sin((angle2-angle1)/2);

 //calculate ends of lines
 f_.x12=f_.x1+Math.cos(angle1)*f_.lc*1.5;
 f_.y12=f_.y1+Math.sin(angle1)*f_.lc*1.5;

 f_.x22=f_.x1+Math.cos(angle2)*f_.lc*1.5;
 f_.y22=f_.y1+Math.sin(angle2)*f_.lc*1.5;
 
 //calculate tangent points
 var yt1=0;
 var xt1= f_.lc*Math.cos((angle2-angle1)/2);
 //rotate all coords acc to f_.angle1
 f_.xt1=f_.x1+xt1*Math.cos(angle1)-Math.sin(angle1)*yt1;
 f_.yt1=f_.y1+xt1*Math.sin(angle1)+Math.cos(angle1)*yt1;

 //rotate all coords acc to f_.angle1
 f_.xt2=f_.x1+xt1*Math.cos(angle2)-Math.sin(angle2)*yt1;
 f_.yt2=f_.y1+xt1*Math.sin(angle2)+Math.cos(angle2)*yt1;

 //f_.xt1=xt1;
 //f_.yt1=yt1;
 
 
/* f_.xt1=f_.x1+Math.cos(angle1)*f_.lc;
 f_.yt1=f_.y1+Math.sin(angle1)*f_.lc;

 f_.xt2=f_.x1+Math.cos(angle2)*f_.lc;
 f_.yt2=f_.y1+Math.sin(angle2)*f_.lc;
 */
 
 //rotate all coords acc to f_.angle1
 f_.xc=f_.x1+xct*Math.cos(angle1)-Math.sin(angle1)*yct;
 f_.yc=f_.y1+xct*Math.sin(angle1)+Math.cos(angle1)*yct;
 
// p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
//p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy

//alert(fillet.canvas_width/fillet_bbox("width")/4);
f_.scale_=(fillet.canvas_width/fillet_bbox("width"))*.5;
//if ((fillet.canvas_height/fillet_bbox("height")*.75)<f_.scale_ ) f_.scale_=(fillet.canvas_height/fillet_bbox("height")*.75);
//jg.setOrigin(fillet_bbox("x")*f_.scale_,(fillet.canvas_height-fillet_bbox("y"))*f_.scale_,1,-1,f_.scale_);

jg.setOrigin(fillet.canvas_width/2-fillet_bbox("x")*f_.scale_,fillet.canvas_height/2+fillet_bbox("y")*f_.scale_,1,-1,f_.scale_);

  jg.clear();
  //jg.drawRect(fillet_bbox("x")-fillet_bbox("width")/2,fillet_bbox("y")-fillet_bbox("height")/2,fillet_bbox("width"),fillet_bbox("height"));
 
 
  
  
  //jg.setColor("#000000"); // black
  //jg.setStroke(Stroke.DOTTED);
  //draw co-ordinate lines
  //jg.drawLine(0, 20/f_.scale_, 0, -20/2/f_.scale_); // co-ordinates of line 1
  //jg.drawLine(-20/f_.scale_, 0, 20/f_.scale_, 0); // co-ordinates of line 1
 
	jg.setStroke(1); 

  
  jg.setColor("#0000ff"); // blue
  jg.drawLine(f_.x1, f_.y1, f_.x12, f_.y12); // co-ordinates of line 1
  jg.drawLine(f_.x1, f_.y1, f_.x22, f_.y22); // co-ordinates of line 2

//draw node points
  //jg.setColor("#000000") //black  

  //draw_point(jg,0,0,f_.n_size/f_.scale_); //0/0
jg.setColor("#0000ff") //red
  draw_point(jg,f_.x1,f_.y1,f_.n_size/f_.scale_); //Origin
  
	jg.setColor("#ff0000") //red  
  draw_point(jg,f_.xc,f_.yc,f_.n_size/f_.scale_); // circle center


  draw_point(jg,f_.xt1,f_.yt1,f_.n_size/f_.scale_); //Tangent point 1
  draw_point(jg,f_.xt2,f_.yt2,f_.n_size/f_.scale_); //Tangent point 2
  
  
  //inscribe circle
  jg.drawEllipse(f_.xc-f_.rad, f_.yc-f_.rad, f_.rad*2, f_.rad*2);
  
  //draw lables
  jg.setColor("#000000") //black
  jg.drawString("L1", f_.x12, f_.y12); // line 1 label 
  jg.drawString("L2", f_.x22, f_.y22); // line 2 label 
if (f_.show_locations){
	jg.drawString("P1("+round(f_.xt1,f_.rnd)+", "+round(f_.yt1,f_.rnd)+")", f_.xt1, f_.yt1); // line 1 label 
	jg.drawString("P2("+round(f_.xt2,f_.rnd)+", "+round(f_.yt2,f_.rnd)+")", f_.xt2, f_.yt2); // line 1 label 
	//  jg.drawString("P2", f_.xt2, f_.yt2); // line 2 label 
	jg.drawString("C("+round(f_.xc,f_.rnd)+", "+round(f_.yc,f_.rnd)+")", f_.xc, f_.yc); // line draw coords of the circle
	//jg.drawString("C", f_.xc, f_.yc); // line draw coords of the circle
	jg.drawString("O("+round(f_.x1,f_.rnd)+", "+round(f_.y1,f_.rnd)+")", f_.x1, f_.y1); // line draw coords of the circle
}else{
	jg.drawString("P1", f_.xt1, f_.yt1); // line 1 label 
	jg.drawString("P2", f_.xt2, f_.yt2); // line 1 label 
	//  jg.drawString("P2", f_.xt2, f_.yt2); // line 2 label 
	jg.drawString("C", f_.xc, f_.yc); // line draw coords of the circle
	//jg.drawString("C", f_.xc, f_.yc); // line draw coords of the circle
	jg.drawString("O", f_.x1, f_.y1); // line draw coords of the circle
 }
//jg.drawString("O", f_.x1, f_.y1); // draw coords of the world


  
  
  
  jg.paint();
}
function init_calc_fillet(){
	//load fillet state
		var ret=localStorage.getItem('fillet_calc_last_state');
		if (ret!== null){
			fillet=JSON.parse(ret);
			//calc_fswizard("",true);
		}else{
			//run calc function	
			//calc_fswizard();
			 fillet.rnd=2;
		}

		var w=viewport().width;//getOffset("").height;
		var h=viewport().height;
		
	fillet.canvas_width=(w > h ? h : w)
	fillet.canvas_height=fillet.canvas_width;

	
editStyleById("fillet_calc_canvas","width",fillet.canvas_width+"px");
editStyleById("fillet_calc_canvas","height",fillet.canvas_height+"px");

Set_Value("fillet_calc_scale",fillet.scale);

Set_Value("fillet_calc_rad",fillet.rad);
Set_Value("fillet_calc_angle1",fillet.angle1);
Set_Value("fillet_calc_angle2",fillet.angle2);
Set_Value("fillet_calc_x1",fillet.x1);
Set_Value("fillet_calc_y1",fillet.y1);
Set_Value("fillet_calc_round",fillet.rnd);
Set_Value("fillet_show_locations",fillet.show_locations);

calc_fillet();
}
//var jg = new jsGraphics("fillet_calc_canvas");
