/**
 * Created by Admin on 22.03.14.
 */
//a shared class for drawing functions
function Drawing(canvas){
    var Maths=new Maths_();
    var bhc=canvas;
    this.fillArc=fillArc;
    function fillArc(x,y,diameter,start_angle,end_angle){
        bhc.fillArc(x-diameter/2, y-diameter/2,diameter, diameter,360-end_angle,360-start_angle);
    }
    this.arc=arc;
    function arc(x,y,diameter,start_angle,end_angle){
        bhc.arc(x-diameter/2, y-diameter/2,diameter, diameter,start_angle,end_angle);
    }
    this.circle=circle;
    function circle(x,y,diameter){
        bhc.drawOval(x-diameter/2, y-diameter/2,diameter, diameter);
    }
    this.dim2point=dim2point;
    function dim2point(x1,y1,x2,y2,shift){
        var angle=Math.atan2((x2-x1),(y2-y1));
        var angle_90=angle-deg2rad(90);
        var dx=Math.sin(angle_90)*shift;
        var dy=Math.cos(angle_90)*shift;

        bhc.drawLine(x1+dx, y1+dy, x2+dx,y2+dy);

        bhc.drawLine(x1, y1, x1+dx,y1+dy);
        bhc.drawLine(x2, y2, x2+dx,y2+dy);

        if (Maths.distance(x1,y1,x2,y2)>shift*2){
            bhc.drawLine(x1+dx, y1+dy, Maths.polar_x(x1+dx,shift/2,angle+deg2rad(25)), Maths.polar_y(y1+dy,shift/2,angle+deg2rad(25)));
            bhc.drawLine(x1+dx, y1+dy, Maths.polar_x(x1+dx,shift/2,angle-deg2rad(25)), Maths.polar_y(y1+dy,shift/2,angle-deg2rad(25)));

            bhc.drawLine(x2+dx, y2+dy, Maths.polar_x(x2+dx,shift/2,angle+deg2rad(205)), Maths.polar_y(y2+dy,shift/2,angle+deg2rad(205)));
            bhc.drawLine(x2+dx, y2+dy, Maths.polar_x(x2+dx,shift/2,angle-deg2rad(205)), Maths.polar_y(y2+dy,shift/2,angle-deg2rad(205)));

            // bhc.drawLine(x1+dx, y1+dy, x2+dx,y2+dy); //arrow1
        }else{
            bhc.drawLine(x1+dx, y1+dy, Maths.polar_x(x1+dx,shift/2,angle+deg2rad(205)), Maths.polar_y(y1+dy,shift/2,angle+deg2rad(205)));
            bhc.drawLine(x1+dx, y1+dy, Maths.polar_x(x1+dx,shift/2,angle-deg2rad(205)), Maths.polar_y(y1+dy,shift/2,angle-deg2rad(205)));

            bhc.drawLine(x2+dx, y2+dy, Maths.polar_x(x2+dx,shift/2,angle+deg2rad(25)), Maths.polar_y(y2+dy,shift/2,angle+deg2rad(25)));
            bhc.drawLine(x2+dx, y2+dy, Maths.polar_x(x2+dx,shift/2,angle-deg2rad(25)), Maths.polar_y(y2+dy,shift/2,angle-deg2rad(25)));

        }
    }
    this.dimangle=dimangle;
    function dimangle(pc_x,pc_y,R,shift,angle1,angle2){


        var x1,y1,x2,y2;
        var x11,y11,x22,y22;

        x1=pc_x+Math.cos(deg2rad(angle1))*R;
        y1=pc_y+Math.sin(deg2rad(angle1))*R;
        x2=x1+Math.cos(deg2rad(angle1-90))*R/10;
        y2=y1+Math.sin(deg2rad(angle1-90))*R/10;

        x11=pc_x+Math.cos(deg2rad(angle2))*R;
        y11=pc_y+Math.sin(deg2rad(angle2))*R;
        x22=x11+Math.cos(deg2rad(angle2+90))*R/10;
        y22=y11+Math.sin(deg2rad(angle2+90))*R/10;


        this.arc(pc_x, pc_y,R *2 ,angle1,angle2);

        //bhc.drawLine(x1,y1,x2,y2 );
        //bhc.drawLine(x11,y11,x22,y22 );
        //Draw arrows

        if (Maths.distance(x1,y1,x11,y22)>shift*2){
            bhc.drawLine(x1, y1, Maths.polar_x(x1,shift,deg2rad(25-angle1)), Maths.polar_y(y1,shift,deg2rad(25-angle1)));
            bhc.drawLine(x1, y1, Maths.polar_x(x1,shift,deg2rad(335-angle1)), Maths.polar_y(y1,shift,deg2rad(335-angle1)));

            bhc.drawLine(x11, y11, Maths.polar_x(x11,shift,deg2rad(155-angle2)), Maths.polar_y(y11,shift,deg2rad(155-angle2)));
            bhc.drawLine(x11, y11, Maths.polar_x(x11,shift,deg2rad(-155-angle2)), Maths.polar_y(y11,shift,deg2rad(-155-angle2)));

            // bhc.drawLine(x1+dx, y1+dy, x2+dx,y2+dy); //arrow1
        }else{
            bhc.drawLine(x1, y1, Maths.polar_x(x1,shift,deg2rad(155-angle1)), Maths.polar_y(y1,shift,deg2rad(155-angle1)));
            bhc.drawLine(x1, y1, Maths.polar_x(x1,shift,deg2rad(-155-angle1)), Maths.polar_y(y1,shift,deg2rad(-155-angle1)));

            bhc.drawLine(x11, y11, Maths.polar_x(x11,shift,deg2rad(25-angle2)), Maths.polar_y(y11,shift,deg2rad(25-angle2)));
            bhc.drawLine(x11, y11, Maths.polar_x(x11,shift,deg2rad(335-angle2)), Maths.polar_y(y11,shift,deg2rad(335-angle2)));
        }
    }
    this.point=point;
    function point(xc,yc,n_size){
        bhc.drawEllipse(xc-n_size, yc-n_size, n_size*2, n_size*2); //Draw circle Center
        bhc.fillArc(xc-n_size, yc-n_size, n_size*2, n_size*2, 0, 90);
        bhc.fillArc(xc-n_size, yc-n_size, n_size*2, n_size*2, 180, 270);
    }
}

//a shared class for mathematical functions
function Maths_(){
    this.polar_x=polar_x;
    function polar_x(x,length,angle_rad){
        return x+Math.sin(angle_rad)*length;

    }
    this.polar_y=polar_y;
    function polar_y(y,length,angle_rad){
        return y+Math.cos(angle_rad)*length;

    }
    this.distance=distance;
    function distance(x1, y1, x2,y2){

        return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));


    }
    this.sasGetSide3=sasGetSide3;
    function sasGetSide3(side1, angle1, side2){
        //if (useDegrees) angle1 = deg2rad(angle1);
        return Math.sqrt(side1 * side1 + side2 * side2 - 2 * side1 * side2 * Math.cos(angle1));
    }
    this.sssGetAngle2=sssGetAngle2;
    function sssGetAngle2(side1, side2, side3){
        var angle = Math.acos((side2 * side2 + side3 * side3 - side1 * side1)/(2 * side2 * side3));
        //if (useDegrees) return rad2deg(angle);
        //else
        return angle;
    }
    this.aaGetAngle3=aaGetAngle3;
    function aaGetAngle3(angle1, angle2){
        //if (useDegrees) return 180 - angle1 - angle2;
        //else return
        Math.PI  - angle1 - angle2;
    }
    this.asaGetSide2=asaGetSide2;
    function asaGetSide2(angle1, side1, angle2){
        //if (useDegrees) angle1 = deg2rad(angle1);
        //if (useDegrees) angle2 = deg2rad(angle2);
        return side1 * (Math.sin(angle1)) / (Math.sin(angle2));
    }
    this.ssaGetAngle2=ssaGetAngle2;
    function ssaGetAngle2(side1,side2,angle1){
        //if (useDegrees) angle1 = deg2rad(angle1);
        var angle = Math.asin(side2 * Math.sin(angle1) / side1);
        //if (useDegrees) return rad2deg(angle);
        //else
            return angle;
    }
    this.line_line_intersection=line_line_intersection;
    function line_line_intersection(p0_x, p0_y,  p1_x,  p1_y, p2_x,  p2_y,  p3_x,  p3_y)
    {
        var i_x;
        var i_y;
        var s1_x, s1_y, s2_x, s2_y;

        s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
        {
            // Collision detected
            if (i_x != NULL)
                i_x = p0_x + (t * s1_x);
            if (i_y != NULL)
                i_y = p0_y + (t * s1_y);
            return {"x":i_x,"y":i_y};

        }

        return false; // No collision
    }
}
