/**
 * Created by Admin on 22.03.14.
 */

function drill_point_calc() {
    var data= new Object();
    var curr_dims;
    var Drw
    var Maths = new Maths_();
    data={
        rnd:0,
        n_size:5,
        canvas_width:400,
        canvas_height:400,
        canvas_x:200,
        canvas_y:200,
        scale_:1,
        scale:1,
        diameter:0.5,
        tip_diameter:0,
        depth:0,
        tip_depth:0,
        effective_dia:.25,
        tip_angle:90,
        show_locations:1};

    var fields={};
    var bhc={};
    var dims={};

    this.init=init;
    function init(fields_) {
        fields=fields_
        bhc = new jsGraphics(fields.canvas);
        Drw = new Drawing(bhc);

        //dims = new jsGraphics(fields.dimentions);

        //load bolt_hole state

        try{
            var ret=null;
            ret=window.localStorage.getItem('drill_point_calc_last_state');
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

        //alert(bolt_hole.canvas_width);
        editStyleById(fields.canvas,"width",data.canvas_width+"px");
        editStyleById(fields.canvas,"height",data.canvas_height+"px");

        Set_Value(fields.scale,data.scale);

        Set_Value(fields.diameter,data.diameter);
        Set_Value(fields.tip_angle,data.tip_angle);
        Set_Value(fields.tip_diameter,data.tip_diameter);
        Set_Value(fields.effective_dia,data.effective_dia);
        Set_Value(fields.depth,data.depth);
        Set_Value(fields.rnd,data.rnd);
        Set_Value(fields.show_locations,data.show_locations);
        Calc();
    }
    this.Calc=Calc;

    function Calc(control){
        current_parent="panel_drill_point_calc";
        editElementByName("clear","innerHTML","");

        data.scale=parseFloat(Get_Value(fields.scale));

        data.diameter=parseFloat(Get_Value(fields.diameter));
        data.tip_diameter=parseFloat(Get_Value(fields.tip_diameter));
        data.effective_dia=parseFloat(Get_Value(fields.effective_dia));
        data.depth=parseFloat(Get_Value(fields.depth));

        data.tip_angle=parseFloat(Get_Value(fields.tip_angle));

        data.rnd=parseFloat(Get_Value(fields.rnd));
        data.show_locations=document.getElementById(fields.show_locations).checked;

        //if (bolt_hole.diameter<=0) {editElementById("error"+fields.diameter,"innerHTML","Diameter must be bigger than 0");return;}
        if (data.diameter <=0 ){
            editElementById("error_"+fields.diameter,"innerHTML","Tool Dia. can not be 0 or less");
            data.diameter=0.5
        }
        if (data.tip_angle <=0 ){
            editElementById("error_"+fields.tip_angle,"innerHTML","Tip Angle must be more than 0");
            data.tip_angle=1
        }
        if (data.tip_diameter <0 ){
            editElementById("error_"+fields.tip_diameter,"innerHTML","Tip Dia can not be less than 0");
            data.tip_diameter=0
        }
        if (data.depth <0 ){
            editElementById("error_"+fields.depth,"innerHTML","Depth can not be less than 0");
            data.depth=0
        }
        if (data.effective_dia <data.tip_diameter ){
            editElementById("error_"+fields.effective_dia,"innerHTML","C-Sink Dia. can not be less than tip dia");
            data.effective_dia=data.tip_diameter
        }
        if (data.effective_dia >data.diameter ){
            editElementById("error_"+fields.effective_dia,"innerHTML","C-Sink Dia. can not be more than tool dia");
            data.effective_dia=0
        }
        if (lic_type!="pro" && data.diameter > 10 ){
            editElementById("error_"+fields.diameter,"innerHTML","Please buy PRO version to unlock");
            data.length=10
        }
        if (lic_type!="pro" && data.rnd > 2 ){
            editElementById("error_"+fields.rnd,"innerHTML","Please buy PRO version to unlock");
            data.rnd=2
        }

        if (typeof(control)!="undefined"){
            if (control.id==fields.depth){
                data.effective_dia=(data.depth/Math.tan(deg2rad(90-data.tip_angle/2))*2)+data.tip_diameter;

            }else{
                data.depth=Math.tan(deg2rad(90-data.tip_angle/2))*(data.effective_dia/2-data.tip_diameter/2);
            }

        }else{
            data.depth=Math.tan(deg2rad(90-data.tip_angle/2))*(data.effective_dia/2-data.tip_diameter/2);
        }


        draw(control);

        Set_Value(fields.effective_dia,round(data.effective_dia,data.rnd));
        //Set_Value(fields.angle,bolt_hole.angle);
        // Set_Value(fields.holes,bolt_hole.holes);
        Set_Value(fields.depth,round(data.depth,data.rnd));
        Set_Value(fields.tip_angle,round(data.tip_angle,data.rnd));
        Set_Value(fields.tip_diameter,round(data.tip_diameter,data.rnd));
        Set_Value(fields.diameter,round(data.diameter,data.rnd));

//display results here
        /*document.getElementById(fields.locations).innerHTML="";
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

            //bolt_hole.hole.x[i]
            //bolt_hole.hole.y[i]

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
            localStorage.setItem('drill_point_calc_last_state', JSON.stringify(data));
        }catch(e){return}

    }
    this.box=box;
    function box(what){
        var b={x:0,x:0};

        var x2= Math.cos(deg2rad(data.angle))*(data.distance+data.length);
        var y2 =Math.sin(deg2rad(data.angle))*(data.distance+data.length);


        b.x=(data.diameter);
        b.y=(data.tip_depth);

        return b[what];

    }
    this.draw_dim =draw_dim;
    function draw_dim(control){
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
        if (control.id==fields.diameter){
            x1=data.diameter/2;


            //bhc.drawLine(bolt_hole.x[0], bolt_hole.y[0], x1, y1); // co-ordinates of line 1
            Drw.dim2point(-x1, data.tip_depth, x1,  data.tip_depth,20/data.scale_); // co-ordinates of line 1

        }
        if (control.id==fields.tip_diameter){
            x1=data.tip_diameter/2;

            //bhc.drawLine(bolt_hole.x[0], bolt_hole.y[0], bolt_hole.x[1],bolt_hole.y[1]); // co-ordinates of line 1
            Drw.dim2point(-x1, 0, x1,  0,20/data.scale_); // co-ordinates of line 1

        }
        if (control.id==fields.depth){
           //bhc.drawLine(bolt_hole.x[0], bolt_hole.y[0], bolt_hole.x[1],bolt_hole.y[1]); // co-ordinates of line 1
            Drw.dim2point(0, 0, 0,  data.depth,20/data.scale_); // co-ordinates of line 1

        }
        if (control.id==fields.effective_dia){
            //bhc.drawLine(bolt_hole.xc, bolt_hole.yc, bolt_hole.x[0],bolt_hole.y[0]); // co-ordinates of line 1
            Drw.dim2point(-data.effective_dia/2, data.depth, data.effective_dia/2, data.depth ,20/data.scale_); // co-ordinates of line 1

        }

        if (control.id==fields.tip_angle){

            var y0=-data.tip_diameter/2/Math.tan(deg2rad(data.tip_angle/2));

            x1=data.diameter/2;
            y1=data.tip_depth


            //bhc.drawLine(data.xc, data.yc, x1,y1); // co-ordinates of line 1
            //bhc.drawLine(data.xc, data.yc,data.xc+data.length, data.yc); // co-ordinates of line 1
            if (data.tip_angle>1){
                //Drw.point(0,y0,20/data.scale_);

                //bhc.drawLine(0,y0, x1,y1); // co-ordinates of line 1
                //bhc.drawLine(0,y0, -x1,y1); // co-ordinates of line 1

                Drw.dimangle(0, y0,Maths.distance(0,y0,x1,y1) *.75,20/data.scale_,90-data.tip_angle/2,90+data.tip_angle/2);
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

        //var angle=deg2rad(f_.tip_angle);

        var w=viewport().width*data.scale*.5;//getOffset("").height;
        var h=viewport().height*data.scale*.5;
        data.canvas_width=(w > h ? h : w)
        data.canvas_height=data.canvas_width;
        editStyleById(fields.canvas,"width",data.canvas_width+"px");
        editStyleById(fields.canvas,"height",data.canvas_height+"px");

        data.tip_depth =Math.tan(deg2rad(90-f_.tip_angle/2))*(f_.diameter/2-f_.tip_diameter/2);

//alert(bolt_hole.canvas_width/fillet_bbox("width")/4);
        if (data.diameter>data.tip_depth){
        data.scale_=(data.canvas_width/(f_.diameter)*.75)//*bolt_hole.scale;
        }else{
            data.scale_=(data.canvas_height/(f_.tip_depth)*.75)//*bolt_hole.scale;
        }
//if ((bolt_hole.canvas_height/fillet_bbox("height")*.75)<bolt_hole.scale ) bolt_hole.scale=(bolt_hole.canvas_height/fillet_bbox("height")*.75);
//bhc.setOrigin(bolt_hole_bbox("x")*bolt_hole.scale,(bolt_hole.canvas_height-bolt_hole_bbox("y"))*bolt_hole.scale,1,-1,bolt_hole.scale);
        bhc.setOrigin(data.canvas_width/2 ,data.canvas_height/2+ box("y")/2*data.scale_,1,-1,data.scale_);
        //bhc.setOrigin(bolt_hole.canvas_width/2,bolt_hole.canvas_width/2,1,-1,bolt_hole.scale_);



        bhc.clear();
        //bhc.drawRect(bolt_hole-bolt_hole_bbox("width")/2,bolt_hole_bbox("y")-bolt_hole_bbox("height")/2,bolt_hole_bbox("width"),bolt_hole_bbox("height"));




        bhc.setColor("#000000"); // black
        //bhc.setStroke(Stroke.DOTTED);
        //draw co-ordinate lines
        //bhc.drawLine(0, 20/data.scale_, 0, -20/data.scale_); // co-ordinates of line 1
        //bhc.drawLine(-20/data.scale_, 0, 20/data.scale_, 0); // co-ordinates of line 1




        bhc.setStroke(1);

        bhc.setColor("#0000ff"); // blue
        //bhc.drawEllipse(-f_.diameter/2, -f_.diameter/2, f_.diameter, f_.diameter);


        data.tip_depth =Math.tan(deg2rad(90-f_.tip_angle/2))*(f_.diameter/2-f_.tip_diameter/2);

        var y1 =data.depth;

        var y= data.tip_depth;

        //draw tool
        bhc.drawLine(-f_.tip_diameter/2, 0, f_.tip_diameter/2, 0); //flat

        bhc.drawLine(f_.tip_diameter/2, 0, f_.diameter/2, y); // co-ordinates of line 1
        bhc.drawLine(-f_.tip_diameter/2, 0, -f_.diameter/2, y); // co-ordinates of line 1

        bhc.drawLine(f_.diameter/2, y,f_.diameter/2,y+f_.diameter/2); // co-ordinates of line 1
        bhc.drawLine(-f_.diameter/2, y,-f_.diameter/2,y+f_.diameter/2); // co-ordinates of line 1

        //draw effective dia
        bhc.drawLine(-f_.effective_dia/2, y1, f_.effective_dia/2, y1); //flat

        //bhc.drawLine(f_.effective_dia/2, 0, f_.effective_dia/2, y); // co-ordinates of line 1
        //bhc.drawLine(-f_.effective_dia/2, 0, -f_.effective_dia/2, y); // co-ordinates of line 1


        bhc.setColor("#000000"); // blue

        if (f_.show_locations){
            bhc.drawString("Depth: "+round(data.depth,f_.rnd)+"<br> Tip Dia: "+round(data.tip_diameter,f_.rnd), 0, 0); //draw label
            bhc.drawString("C-Sink Dia: "+round(data.effective_dia,f_.rnd), 0, data.depth); //draw label
            bhc.drawString("Tool Dia: "+round(data.diameter,f_.rnd), 0, data.tip_depth); //draw label

        }else{

        }


        /*for (i=0;i<f_.holes;i++){

            x =Math.cos(angle)*f_.distance+Math.cos(angle)*f_.spacing*i;
            y =Math.sin(angle)*f_.distance+Math.sin(angle)*f_.spacing*i;

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

        }*/

        draw_dim(control);
        bhc.paint();
    }
}