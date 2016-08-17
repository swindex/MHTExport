/**
 * Created by Admin on 01.09.14.
 */
function ref_90deg_FHS(){
    var xml='<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><data-set xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><capscrew><size>Screw Size</size><dec_size>Decimal Size (mm)</dec_size><hex_size>Hex Size</hex_size><spline_size>Spline Size</spline_size><head_dia>Head Diameter</head_dia><head_height>Head Height</head_height><csink_dia>Countersink Diameter</csink_dia><csink_depth>Countersink Depth</csink_depth><hole_norm>Clearance Drill Norm. Fit</hole_norm><hole_close>Clearance Drill Close Fit</hole_close></capscrew><capscrew><size>M2</size><dec_size>2</dec_size><hex_size>1.3</hex_size><head_dia>4</head_dia><head_height>1.2</head_height><csink_dia>4.4</csink_dia><csink_depth>1.3</csink_depth><hole_norm>2.4</hole_norm><hole_close>2.2</hole_close></capscrew><capscrew><size>M2.5</size><dec_size>2.5</dec_size><hex_size>1.5</hex_size><head_dia>5</head_dia><head_height>1.5</head_height><csink_dia>5.5</csink_dia><csink_depth>1.6</csink_depth><hole_norm>3</hole_norm><hole_close>2.7</hole_close></capscrew><capscrew><size>M3</size><dec_size>3</dec_size><hex_size>2</hex_size><head_dia>6</head_dia><head_height>1.7</head_height><csink_dia>6.4</csink_dia><csink_depth>1.8</csink_depth><hole_norm>3.7</hole_norm><hole_close>3.4</hole_close></capscrew><capscrew><size>M4</size><dec_size>4</dec_size><hex_size>2.5</hex_size><head_dia>8</head_dia><head_height>2.3</head_height><csink_dia>8.6</csink_dia><csink_depth>2.4</csink_depth><hole_norm>4.8</hole_norm><hole_close>4.4</hole_close></capscrew><capscrew><size>M5</size><dec_size>5</dec_size><hex_size>3</hex_size><head_dia>10</head_dia><head_height>2.8</head_height><csink_dia>10.6</csink_dia><csink_depth>2.9</csink_depth><hole_norm>5.8</hole_norm><hole_close>5.4</hole_close></capscrew><capscrew><size>M6</size><dec_size>6</dec_size><hex_size>4</hex_size><head_dia>12</head_dia><head_height>3.3</head_height><csink_dia>12.6</csink_dia><csink_depth>3.4</csink_depth><hole_norm>6.8</hole_norm><hole_close>6.4</hole_close></capscrew><capscrew><size>M8</size><dec_size>8</dec_size><hex_size>5</hex_size><head_dia>16</head_dia><head_height>4.4</head_height><csink_dia>16.8</csink_dia><csink_depth>4.5</csink_depth><hole_norm>8.8</hole_norm><hole_close>8.4</hole_close></capscrew><capscrew><size>M10</size><dec_size>10</dec_size><hex_size>6</hex_size><head_dia>20</head_dia><head_height>5.5</head_height><csink_dia>21</csink_dia><csink_depth>5.6</csink_depth><hole_norm>10.8</hole_norm><hole_close>10.5</hole_close></capscrew><capscrew><size>M12</size><dec_size>12</dec_size><hex_size>8</hex_size><head_dia>24</head_dia><head_height>6.5</head_height><csink_dia>25</csink_dia><csink_depth>6.6</csink_depth><hole_norm>13</hole_norm><hole_close>12.5</hole_close></capscrew><capscrew><size>M14</size><dec_size>14</dec_size><hex_size>10</hex_size><head_dia>27</head_dia><head_height>7</head_height><csink_dia>28</csink_dia><csink_depth>7.1</csink_depth><hole_norm>15</hole_norm><hole_close>14.5</hole_close></capscrew><capscrew><size>M16</size><dec_size>16</dec_size><hex_size>10</hex_size><head_dia>30</head_dia><head_height>7.5</head_height><csink_dia>31</csink_dia><csink_depth>7.6</csink_depth><hole_norm>17</hole_norm><hole_close>16.5</hole_close></capscrew><capscrew><size>M18</size><dec_size>18</dec_size><hex_size>10</hex_size><head_dia>33</head_dia><head_height>8</head_height><csink_dia>34</csink_dia><csink_depth>8.1</csink_depth><hole_norm>19</hole_norm><hole_close>18.5</hole_close></capscrew><capscrew><size>M20</size><dec_size>20</dec_size><hex_size>12</hex_size><head_dia>36</head_dia><head_height>8.5</head_height><csink_dia>37</csink_dia><csink_depth>8.6</csink_depth><hole_norm>21</hole_norm><hole_close>20.5</hole_close></capscrew><capscrew><size>M24</size><dec_size>24</dec_size><hex_size>14</hex_size><head_dia>39</head_dia><head_height>14</head_height><csink_dia>52</csink_dia><csink_depth>14.1</csink_depth><hole_norm>25</hole_norm><hole_close>24.5</hole_close></capscrew></data-set>';
    var dom={};
    var fields={};
    var data={};
    var prev_selectedrow={};
    data={
        rnd:0,
        n_size:5,
        canvas_width:600,
        canvas_height:200,
        canvas_x:200,
        canvas_y:200,
        scale_:1,
        scale:1,
        title:"90º Flat Head Screw",
        size:"1/4",
        dec_size:0.25,
        hex_size:"3/16",
        spline_size:"1/16",
        head_dia:0.375,
        head_height:0.25,
        csink_depth:0.25,
        csink_dia:0.278,
        hole_close:0.255,
        hole_norm:0.281,
        show_locations:1};

this.init=init;
    function init(fields_){
        fields=fields_

        bhc = new jsGraphics(fields.canvas);
        drw = new Drawing(bhc);
        dom=XML_Get_Table(xml,"capscrew");
        draw_Table(fields.table,dom,undefined,undefined,true);

       select(1);

    }
    function select(index){

        data.size=dom[index]['size'];
        data.size=dom[index]['size'];
        data.dec_size=dom[index]['dec_size'];
        data.hex_size=dom[index]['hex_size'];
        data.spline_size=dom[index]['spline_size'];
        data.head_dia=dom[index]['head_dia'];
        data.head_height=dom[index]['head_height'];
        data.csink_depth=dom[index]['csink_depth'];
        data.csink_dia=dom[index]['csink_dia'];
        data.hole_close=dom[index]['hole_close'];
        data.hole_norm=dom[index]['hole_norm'];

        //this.className="selected";
      /*prev_selectedrow=this;*/
         //alert(dTable[row]['size']);
        draw();
    }
    function draw(){

        editStyleById(fields.canvas,"width",data.canvas_width+"px");
        editStyleById(fields.canvas,"height",data.canvas_height+"px");

        bhc.setOrigin(data.canvas_width/2-170-50 ,data.canvas_height/2,1,-1,1);
        bhc.clear();
        bhc.setColor("#000000"); // black

        bhc.drawString(data.size+ "  "+data.title,15,85);


        bhc.setStroke(Stroke.DOTTED);

        bhc.drawLine(-10, 0, 60+130, 0); // co-ordinates of line 1
        bhc.setStroke(1);
        //bhc.drawRect( 0,-50,35,100);//head
        bhc.drawLine(0, -50, 35, -25);
        bhc.drawLine(0, 50, 35, 25);
        bhc.drawLine(0, 50, 0, -50);


        bhc.drawRect( 35,-25,120,50);//body

        bhc.setColor("#0000ff"); // blue
        drw.dim2point(0,-50,0,50,20);
        bhc.drawString(data.head_dia,-65,5);



        drw.dim2point(120,-25,120,25,20);
        bhc.drawString(data.dec_size,115,15);

        drw.dim2point(35,-50,0,-50,20);
        bhc.drawString(data.head_height,5,-75);
        bhc.paint();

        //draw c-bore
        bhc.setOrigin(data.canvas_width/2+60 ,data.canvas_height/2,1,-1,1);

        //bhc.clear();
        bhc.setColor("#777777"); // gray
        bhc.fillRect( 0,-80,36+120,160);//fill

        bhc.setColor("white"); // white
       // bhc.fillRect( 0,-40,60,80);//head
        bhc.fillRect( 35,-25,120,50);//body




        var x=[0,35,35,0];
        var y=[-50,-25,25,50];

        bhc.fillPolygon(x,y);


        bhc.setColor("#000000"); // black
        bhc.setStroke(1);
        bhc.drawPolygon(x,y);

//        bhc.drawRect( 0,-40,60,80);//head

        bhc.drawRect( 35,-25,120,50);//body

        bhc.setStroke(Stroke.DOTTED);
        bhc.drawLine(-10, 0, 60+130, 0); // co-ordinates of line 1

        bhc.setStroke(1);

        bhc.setColor("#0000ff"); // blue
        drw.dim2point(0,-50,0,50,20);
        bhc.drawString(data.csink_dia,-65,5);

        drw.dim2point(120,-25,120,25,20);
        bhc.drawString(data.hole_close,115,15);
        bhc.drawString(data.hole_norm,115,0);

        drw.dim2point(0,-15,35,-15,20);
        bhc.drawString(data.csink_depth,0,0);



        bhc.setStroke(1);

        bhc.setColor("#0000ff"); // blue

        bhc.paint();
    }
    function draw_Table(target_id,dTable,headers_name_title_style,selected_row,firstrow_is_header){

        var c,r,t
        t = document.createElement('table');
        t.border=0;
        t.cellSpacing=1;
        t.cellPadding=3;

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
                if (is_IE)
                    r.setAttribute("value",row);
                else
                    r.value=row;

                r.onclick=function (e) {
                    if (is_IE){
                        var r=this.getAttribute("value");
                        this.setAttribute("oldClass",this.className);
                        if (prev_selectedrow.className!= undefined){
                            prev_selectedrow.className=prev_selectedrow.getAttribute("oldClass");
                        }

                    }else{
                        var r=this.value;
                        this.oldClass=this.className;
                        if (prev_selectedrow.className!= undefined){
                            prev_selectedrow.className=prev_selectedrow.oldClass;
                        }

                    }
                        data.size=dTable[r]['size'];
                        data.size=dTable[r]['size'];
                        data.dec_size=dTable[r]['dec_size'];
                        data.hex_size=dTable[r]['hex_size'];
                        data.spline_size=dTable[r]['spline_size'];
                        data.head_dia=dTable[r]['head_dia'];
                        data.head_height=dTable[r]['head_height'];
                        data.csink_depth=dTable[r]['csink_depth'];
                        data.csink_dia=dTable[r]['csink_dia'];
                        data.hole_close=dTable[r]['hole_close'];
                        data.hole_norm=dTable[r]['hole_norm'];
                        this.className="selected";
                        prev_selectedrow=this;


                    //alert(dTable[row]['size']);
                        draw();
                }
                
                
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
}