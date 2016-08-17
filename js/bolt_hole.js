function bolt_hole_calc(){
var data= new Object();
var curr_dims;
var Drw;
var fields={};
var bhc={};
var dims={};

var data= new Object();
			data={
				rnd:0,
				n_size:5,
				canvas_width:400,
				canvas_height:400,
				canvas_x:200,
				canvas_y:200,
				scale_:1,
				scale:1,
				diameter:10,				
				holes:10,
				angle:0,
				xc:0,
				yc:0,
				show_locations:1,
				x:Array(),
				y:Array()
			}
 
    this.init=init;
function init(fields_) {
	    fields=fields_
        bhc = new jsGraphics(fields.canvas);
        Drw = new Drawing(bhc);

        //dims = new jsGraphics(fields.dimentions);

        //load data state
		try{
		var ret=null;
 	     ret=window.localStorage.getItem('bolt_hole_calc_last_state');
		 if (ret!== null){
		    data=JSON.parse(ret);
        }else{
           data.rnd=3;
		}
		}catch(e){
			data.rnd=3;
		};
        var w=viewport().width;//getOffset("").height;
        var h=viewport().height;
        data.canvas_width=(w > h ? h : w)
        data.canvas_height=data.canvas_width;

        //alert(data.canvas_width);
        editStyleById(fields.canvas,"width",data.canvas_width+"px");
        editStyleById(fields.canvas,"height",data.canvas_height+"px");

        Set_Value(fields.scale,data.scale);
		Set_Value(fields.diameter,data.diameter);
		Set_Value(fields.angle,data.angle);
		Set_Value(fields.holes,data.holes);
		Set_Value(fields.xc,data.xc);
		Set_Value(fields.yc,data.yc);
		Set_Value(fields.rnd,data.rnd);
		Set_Value(fields.show_locations,data.show_locations);
		Calc();
	}
this.Calc=Calc;
function Calc(control){
current_parent="panel_bolt_hole_calc";
editElementByName("clear","innerHTML","");

data.scale=parseFloat(Get_Value(fields.scale));

data.diameter=parseFloat(Get_Value(fields.diameter));
data.holes=parseFloat(Get_Value(fields.holes));
data.angle=parseFloat(Get_Value(fields.angle));

data.xc=parseFloat(Get_Value(fields.xc));
data.yc=parseFloat(Get_Value(fields.yc));


data.rnd=parseFloat(Get_Value(fields.rnd));
data.show_locations=document.getElementById(fields.show_locations).checked;

if (data.diameter<=0) {editElementById("error_"+fields.diameter,"innerHTML","Diameter must be bigger than 0");return;}

if (lic_type!="pro" && data.diameter > 10 ){
	editElementById("error_"+fields.diameter,"innerHTML","Please buy PRO version to unlock");
	data.diameter=10
}
if (lic_type!="pro" && data.rnd > 2 ){
	editElementById("error_"+fields.rnd,"innerHTML","Please buy PRO version to unlock");
	data.rnd=2
}

draw(control);

//        Set_Value(fields.scale,data.scale);
		Set_Value(fields.diameter,data.diameter);
		Set_Value(fields.angle,data.angle);
		Set_Value(fields.holes,data.holes);
		Set_Value(fields.xc,data.xc);
		Set_Value(fields.yc,data.yc);
		Set_Value(fields.rnd,data.rnd);
		Set_Value(fields.show_locations,data.show_locations);

//display results here
document.getElementById(fields.locations).innerHTML="";
	var c,r,t
	t = document.createElement('table');
	t.border=0;
	t.cellSpacing=1;
	t.className="reference_table_body";
	
		r = t.insertRow(0);
		r.className="header"
		c=r.insertCell(0);
		c.innerHTML="Hole"
		c=r.insertCell(1);
		c.innerHTML="X"
		c=r.insertCell(2);
		c.innerHTML="Y"

 for (i=0;i<data.x.length;i++){
  	
	//data.hole.x[i]
	//data.hole.y[i]
	
		r = t.insertRow(i+1);
		if (isOdd(i))r.className="odd";
		c=r.insertCell(0);
		c.innerHTML=i+1
		c=r.insertCell(1);
		c.innerHTML=round(data.x[i],data.rnd)
		c=r.insertCell(2);
		c.innerHTML=round(data.y[i],data.rnd)
		
  }
  document.getElementById(fields.locations).appendChild(t);
  
	try{
		localStorage.setItem('bolt_hole_calc_last_state', JSON.stringify(data));
	}catch(e){return}

}
    this.draw_dim =draw_dim;
    function draw_dim(control){
        if (typeof(control)=="undefined")return;

        var x =0;
        var y =0;
        var x1 =0;
        var y1 =0;

        bhc.setColor("green"); //
        if (control.id==fields.diameter){
            //x1=data.x[data.x.length-1];
            //y1=data.y[data.y.length-1];
            Drw.dim2point(-data.diameter/2,0, data.diameter/2, 0,20/data.scale_); // co-ordinates of line 1
        }
        if (control.id==fields.angle){
            x1=data.x[0]//-data.xc;
            y1=data.y[0]//-data.yc;
            bhc.drawLine(0, 0, x1,y1); // co-ordinates of line 1
            bhc.drawLine(0, 0,data.diameter/2, 0); // co-ordinates of line 1
            if (data.angle>1){
                Drw.dimangle(0, 0,40/data.scale_, 20/data.scale_,0,data.angle);
            }
        }


        /* if (control.id==fields.spacing){
         Drw.dim2point(data.x[0]-data.xc, data.y[0]-data.yc,data.x[1]-data.xc,data.y[1]-data.yc ,20/data.scale_); // co-ordinates of line 1
         }
         if (control.id==fields.distance){
         //bhc.drawLine(data.xc, data.yc, data.x[0],data.y[0]); // co-ordinates of line 1
         Drw.dim2point(0, 0,data.x[0]-data.xc,data.y[0]-data.yc ,20/data.scale_); // co-ordinates of line 1
         }

         if (control.id==fields.angle){
         x1=data.x[data.x.length-1]-data.xc;
         y1=data.y[data.y.length-1]-data.yc;
         bhc.drawLine(0, 0, x1,y1); // co-ordinates of line 1
         bhc.drawLine(0, 0,data.length, 0); // co-ordinates of line 1
         if (data.angle>1){
         Drw.dimangle(0, 0,40/data.scale_, 20/data.scale_,0,data.angle);
         }
         }
         if (control.id==fields.xc || control.id==fields.yc){
         Drw.point(data.xc, data.yc,10/data.scale_)
         }*/
        bhc.paint();
    }
this.draw=draw
function draw(control)
{
var f_=data;

 var angle=deg2rad(f_.angle);

 	var w=viewport().width*data.scale*.5;//getOffset("").height;
	var h=viewport().height*data.scale*.5;
	data.canvas_width=(w > h ? h : w)
	data.canvas_height=data.canvas_width;
	editStyleById(fields.canvas,"width",data.canvas_width+"px");
	editStyleById(fields.canvas,"height",data.canvas_height+"px");

//alert(data.canvas_width/fillet_bbox("width")/4);
data.scale_=(data.canvas_width/f_.diameter*.75)//*data.scale;
//if ((data.canvas_height/fillet_bbox("height")*.75)<data.scale ) data.scale=(data.canvas_height/fillet_bbox("height")*.75);
//bhc.setOrigin(bolt_hole_bbox("x")*data.scale,(data.canvas_height-bolt_hole_bbox("y"))*data.scale,1,-1,data.scale);
bhc.setOrigin(data.canvas_width/2,data.canvas_height/2,1,-1,data.scale_);



  bhc.clear();
  //bhc.drawRect(data-bolt_hole_bbox("width")/2,bolt_hole_bbox("y")-bolt_hole_bbox("height")/2,bolt_hole_bbox("width"),bolt_hole_bbox("height"));
 
 

  
  bhc.setColor("#000000"); // black
  //bhc.setStroke(Stroke.DOTTED);
  //draw co-ordinate lines
  bhc.drawLine(0, 20/data.scale_, 0, -20/data.scale_); // co-ordinates of line 1
  bhc.drawLine(-20/data.scale_, 0, 20/data.scale_, 0); // co-ordinates of line 1
 
 
 
 
	bhc.setStroke(1); 

  bhc.setColor("#0000ff"); // blue
  bhc.drawEllipse(-f_.diameter/2, -f_.diameter/2, f_.diameter, f_.diameter);
  
 var x =0;
 var y =0;
 var x1 =0;
 var y1 =0;


var d_angle=deg2rad(360)/(f_.holes);

 
f_.x=Array()
f_.y=Array()
 
 
 	if (f_.show_locations){
		bhc.drawString("Xc "+round(f_.xc,f_.rnd)+"; Yc "+round(f_.yc,f_.rnd), 0, 0); //draw label
	}else{
		bhc.drawString("C", 0,0); //draw label
	}

 
  for (i=0;i<f_.holes;i++){
  
	x =Math.cos(angle+d_angle*(i))*f_.diameter/2;
	y =Math.sin(angle+d_angle*(i))*f_.diameter/2;

	x1 =f_.xc+x;
	y1 =f_.yc+y;
	bhc.setColor("#ff0000"); // red
	Drw.point(x,y,f_.n_size/data.scale_); //draw points
	bhc.setColor("#000000"); // black
	if (f_.show_locations){
		bhc.drawString("#"+(i+1)+"<br>X "+round(x1,f_.rnd)+"; Y "+round(y1,f_.rnd), x, y); //draw label
	}else{
		bhc.drawString("#"+(i+1), x, y); //draw label
	}
	f_.x[i]=x1
	f_.y[i]=y1

  }
    draw_dim(control);
  bhc.paint();
}
}