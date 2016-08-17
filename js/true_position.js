/**
 * Created by Admin on 15.03.14.
 */
function true_position_calc() {
var data= new Object();
var curr_dims;
var Drw
data={
    rnd:0,
    n_size:5,
    canvas_width:400,
    canvas_height:400,
    canvas_x:200,
    canvas_y:200,
    scale_:1,
    scale:1,
    real_tolerance:0,
    drw_tolerance:0,
    exc_tolerance:0,
    real_x:1.5,
    drw_x:1.5,
    d_x:0,
    real_y:2.5,
    drw_y:2.5,
    d_y:0,
    show_locations:1}
    var fields={};
    var bhc={};
    var dims={};

    this.init=init;
    function init(fields_) {
        fields=fields_
        bhc = new jsGraphics(fields.canvas);
        Drw = new Drawing(bhc);

        //dims = new jsGraphics(fields.dimentions);

        //load data state
        var ret=localStorage.getItem('true_position_last_state');
        if (ret!== null){
            data=JSON.parse(ret);
            //calc_fswizard("",true);
        }else{
            //run calc function
            //calc_fswizard();
            data.rnd=2;
        }

        var w=viewport().width;//getOffset("").height;
        var h=viewport().height;
        data.canvas_width=(w > h ? h : w)
        data.canvas_height=data.canvas_width;

        //alert(data.canvas_width);
        editStyleById(fields.canvas,"width",data.canvas_width+"px");
        editStyleById(fields.canvas,"height",data.canvas_height+"px");

        Set_Value(fields.scale,data.scale);

        Set_Value(fields.real_tolerance,data.real_tolerance);
        Set_Value(fields.drw_tolerance,data.drw_tolerance);
        Set_Value(fields.exc_tolerance,data.exc_tolerance);
        Set_Value(fields.real_x,data.real_x);
        Set_Value(fields.drw_x,data.drw_x);
        Set_Value(fields.d_x,data.d_x);
        Set_Value(fields.real_y,data.real_y);
        Set_Value(fields.drw_y,data.drw_y);



        Set_Value(fields.rnd,data.rnd);
        Set_Value(fields.show_locations,data.show_locations);
        Calc();
    }
    this.Calc=Calc;

function Calc(control){
    current_parent="true_position_hole_line_calc";
    editElementByName("clear","innerHTML","");

    data.scale=parseFloat(Get_Value(fields.scale));
    data.rnd=parseFloat(Get_Value(fields.rnd));
    data.show_locations=document.getElementById(fields.show_locations).checked;


    data.real_tolerance=parseFloat(Get_Value(fields.real_tolerance));
    data.drw_tolerance=parseFloat(Get_Value(fields.drw_tolerance));
    data.exc_tolerance=parseFloat(Get_Value(fields.exc_tolerance));
    data.real_x=parseFloat(Get_Value(fields.real_x));
    data.drw_x=parseFloat(Get_Value(fields.drw_x));
    data.d_x=parseFloat(Get_Value(fields.d_x));
    data.real_y=parseFloat(Get_Value(fields.real_y));
    data.drw_y=parseFloat(Get_Value(fields.drw_y));
    data.d_y=parseFloat(Get_Value(fields.d_y));

    if (typeof(control)!="undefined"){
        if (control.id==fields.real_x || control.id==fields.drw_x){
            data.d_x=data.drw_x-data.real_x
        }
        if (control.id==fields.real_y || control.id==fields.drw_y){
            data.d_y=data.drw_y-data.real_y
        }
    }else{
        //data.length=data.spacing*(data.holes-1)

    }

    data.real_tolerance=2*Math.sqrt(Math.pow(data.dx,2)+Math.pow(data.dy,2));
    data.exc_tolerance=data.drw_tolerance-data.real_tolerance
    //if (data.diameter<=0) {editElementById("error"+fields.diameter,"innerHTML","Diameter must be bigger than 0");return;}

   /* if (lic_type!="pro" && data.length > 10 ){
        editElementById("error_"+fields.length,"innerHTML","Please buy PRO version to unlock");
        data.length=10
    }*/
    if (lic_type!="pro" && data.rnd > 2 ){
        editElementById("error_"+fields.rnd,"innerHTML","Please buy PRO version to unlock");
        data.rnd=2
    }



    draw(control);

    Set_Value(fields.d_x,data.d_x);
    Set_Value(fields.d_y,data.d_y);
    Set_Value(fields.real_tolerance,data.real_tolerance);
    Set_Value(fields.exc_tolerance,data.exc_tolerance);
    Set_Value(fields.drw_tolerance,data.drw_tolerance);

    //Set_Value(fields.angle,data.angle);
   // Set_Value(fields.holes,data.holes);
    //Set_Value(fields.spacing,data.spacing);
//display results here
 /*   document.getElementById(fields.locations).innerHTML="";
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
*/
    try{
        localStorage.setItem('true_position_last_state', JSON.stringify(data));
    }catch(e){return}

}
    this.box=box;
function box(what){
    var b={x:0,x:0};
    var x2= Math.cos(deg2rad(data.angle))*(data.distance+data.length);
    var y2 =Math.sin(deg2rad(data.angle))*(data.distance+data.length);


    b.x=(x2-data.xc)/2;
    b.y=(y2-data.yc)/2;

return b[what];

}
    this.draw_dim =draw_dim;
function draw_dim(control){
    return;
    if (typeof(control)=="undefined")return;

   // control=curr_dims;


    var x =0;
    var y =0;
    var x1 =0;
    var y1 =0;




    //f_.x=Array()
    //f_.y=Array()


   /* if (f_.show_locations){
        bhc.drawString("Xc "+round(f_.xc,f_.rnd)+"; Yc "+round(f_.yc,f_.rnd), 0, 0); //draw label
    }else{
        bhc.drawString("C", 0,0); //draw label
    }*/
    bhc.setColor("green"); //
    if (control.id==fields.length){
     x1=data.x[data.x.length-1];
     y1=data.y[data.y.length-1];

        //bhc.drawLine(data.x[0], data.y[0], x1, y1); // co-ordinates of line 1
        Drw.dim2point(data.x[0], data.y[0], x1, y1,20/data.scale_); // co-ordinates of line 1

    }
    if (control.id==fields.spacing){
        //bhc.drawLine(data.x[0], data.y[0], data.x[1],data.y[1]); // co-ordinates of line 1
        Drw.dim2point(data.x[0], data.y[0],data.x[1],data.y[1] ,20/data.scale_); // co-ordinates of line 1

    }
    if (control.id==fields.distance){
        //bhc.drawLine(data.xc, data.yc, data.x[0],data.y[0]); // co-ordinates of line 1
        Drw.dim2point(data.xc, data.yc,data.x[0],data.y[0] ,20/data.scale_); // co-ordinates of line 1

    }

    if (control.id==fields.angle){
        x1=data.x[data.x.length-1];
        y1=data.y[data.y.length-1];
        bhc.drawLine(data.xc, data.yc, x1,y1); // co-ordinates of line 1
        bhc.drawLine(data.xc, data.yc,data.xc+data.length, data.yc); // co-ordinates of line 1
        if (data.angle>1){
        Drw.dimangle(data.xc, data.yc,40/data.scale_, 20/data.scale_,0,data.angle);
        }
    }
    if (control.id==fields.xc || control.id==fields.yc){
        draw_point(bhc,data.xc, data.yc,10/data.scale_)
    }
    bhc.paint();
    }
      
    

    this.draw=draw;
function draw(control)
{
    var f_=data;

       var w=viewport().width*data.scale*.5;//getOffset("").height;
    var h=viewport().height*data.scale*.5;
    data.canvas_width=(w > h ? h : w)
    data.canvas_height=data.canvas_width;
    editStyleById(fields.canvas,"width",data.canvas_width+"px");
    editStyleById(fields.canvas,"height",data.canvas_height+"px");

//alert(data.canvas_width/fillet_bbox("width")/4);
    data.scale_=(data.canvas_width/(f_.length+f_.distance)*.75)//*data.scale;
//if ((data.canvas_height/fillet_bbox("height")*.75)<data.scale ) data.scale=(data.canvas_height/fillet_bbox("height")*.75);
//bhc.setOrigin(data_bbox("x")*data.scale,(data.canvas_height-data_bbox("y"))*data.scale,1,-1,data.scale);
    bhc.setOrigin(data.canvas_width/2- box("x")*data.scale_,data.canvas_height/2+box("y")*data.scale_,1,-1,data.scale_);
    //bhc.setOrigin(data.canvas_width/2,data.canvas_width/2,1,-1,data.scale_);



    bhc.clear();
    //bhc.drawRect(data-data_bbox("width")/2,data_bbox("y")-data_bbox("height")/2,data_bbox("width"),data_bbox("height"));




    bhc.setColor("#000000"); // black
    //bhc.setStroke(Stroke.DOTTED);
    //draw co-ordinate lines
    bhc.drawLine(0, 20/data.scale_, 0, -20/data.scale_); // co-ordinates of line 1
    bhc.drawLine(-20/data.scale_, 0, 20/data.scale_, 0); // co-ordinates of line 1

    Drw.circle(0,0,100/data.scale_) // draw True position tolerance circle


    bhc.setStroke(1);

    bhc.setColor("#0000ff"); // blue
    //bhc.drawEllipse(-f_.diameter/2, -f_.diameter/2, f_.diameter, f_.diameter);

    Drw.point(f_.d_x,f_.d_y,f_.n_size/data.scale_); //draw Real point


    //draw_dim(control);
    bhc.paint();
}
}