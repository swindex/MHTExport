function scientific_calc(){
    var data= new Object();
    var result=0;
    var curr_dims;
    var Drw;
    var fields={};
    var bhc={};
    var dims={};
    var display_input={};

    var display_formula={};
    var formula="";
    var br_level=0;
    var close_bracket=false;
    var close_bracket_level=0;
    var close_inv_bracket=false;
    var memory=0;

    var operator="operator";
    var number="number";
    var func="func";
    var enter="enter";
    var nothing="";

    var last_input=nothing;



    var kb_vibrate_time=25;
				var kb_vibrate=true;
				var kb_down=false;
				
				var custom_kb_field_value="";
				var custom_kb_field_bg_color="";
				var custom_kb_field_color="";
				var custom_kb_field_selection_status=false;
this.init=init;
    function init(fields_){
        fields=fields_
        display_input=document.getElementById(fields.input);
        display_formula=document.getElementById(fields.result);
    //display_formula.onkeydown= function(e){e.preventDefault();};
    //display_input.onkeydown=function(e){e.preventDefault();};

        //'display_formula.onfocus= function(e){e.blur();};
        //display_input.onfocus=function(e){e.blur();};


    }

    this.type=type;
    function type(chr){

        //customKB_unselect()
        var r_val=display_input.innerHTML
        if (r_val=="0"){r_val="";}
        if (last_input != number && last_input != operator){formula="";display_formula.innerHTML="";r_val="";}

        display_input.innerHTML=r_val+chr.toString()

        last_input=number;
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
        return false;
    }
    function add_input(operand,display_operand){
        var r_val=display_input.innerHTML;
        var r_val_d=r_val;
        if (last_input==enter){formula="";display_formula.innerHTML="";}

        if (close_bracket==true && close_bracket_level==br_level){
            r_val=r_val+")";close_bracket=false;close_bracket_level=0;
        }

        if (last_input==number && operand=="(" ){return;}
        if (br_level <= 0 && operand==")" ){br_level=0;return;}

        if (r_val!="0" && operand=="(" && last_input==number ){r_val=r_val+"*";r_val_d=r_val_d+"x";
            formula=formula+r_val.toString()//+operand;
            if (display_operand != null){
                display_formula.innerHTML=display_formula.innerHTML+r_val_d.toString()//+display_operand
            }else{
                display_formula.innerHTML=display_formula.innerHTML+r_val_d.toString()//+operand
            }
            r_val="";r_val_d="";
        }
        if (r_val=="0" && operand=="(" ){r_val="";r_val_d="";}


        if (formula.charAt(formula.length - 1) ==")" ){r_val="";r_val_d=""}
        //if (formula.charAt(formula.length - 1) ==")" ){r_val=""}

            display_input.innerHTML="0"
            if (display_operand != null){
                display_formula.innerHTML=display_formula.innerHTML+r_val_d.toString()+display_operand
            }else{
                display_formula.innerHTML=display_formula.innerHTML+r_val_d.toString()+operand
            }
        /*if (br_level==0 && (operand=="+" ||operand=="-")){
            //formula=formula+r_val.toString()+operand;
            try{
                formula=eval(formula+r_val.toString())+operand;
                display_formula.innerHTML=formula
            }catch(e){
                //alert(e+" " + formula)
            }

        }else{*/
            formula=formula+r_val.toString()+operand;
        //}

        last_input=operator;

    }
    function add_function(operand,display_operand){
        var r_val=display_input.innerHTML;
        if (last_input==enter ){formula="";display_formula.innerHTML="";}
        //if (formula.charAt(formula.length - 1) ==")" ){formula="";display_formula.innerHTML="";}

        if (formula.charAt(formula.length - 1)==")"){
            var val1=formula.slice(0,formula.lastIndexOf("("))
            var r_val=formula.slice(formula.lastIndexOf("("))
            formula=val1+operand+r_val+")"

            var dval1=display_formula.innerHTML.slice(0,display_formula.innerHTML.lastIndexOf("("))
            var dval2=display_formula.innerHTML.slice(display_formula.innerHTML.lastIndexOf("("))
            display_formula.innerHTML=dval1+display_operand+dval2
        }else{
            formula=formula+operand+r_val+")"

            display_formula.innerHTML= display_formula.innerHTML+display_operand+r_val
            display_input.innerHTML = ""
        }
        precalc(operand+r_val+")");
        last_input=func;

    }

    /** Function count the occurrences of substring in a string;
     * @param {String} string   Required. The string;
     * @param {String} subString    Required. The string to search for;
     * @param {Boolean} allowOverlapping    Optional. Default: false;
     */
    function count(string, subString, allowOverlapping){

        string+=""; subString+="";
        if(subString.length<=0) return string.length+1;

        var n=0, pos=0;
        var step=(allowOverlapping)?(1):(subString.length);

        while(true){
            pos=string.indexOf(subString,pos);
            if(pos>=0){ n++; pos+=step; } else break;
        }
        return(n);
    }
    function GetSubstringIndex(str, substring, n) {
        var times = 0, index = null;

        while (times < n && index !== -1) {
            index = str.indexOf(substring, index+1);
            times++;
        }

        return index;
    }
    function reverseStr ( str ) {
        var tR = [ ];
        str = str.split("");
        for ( var i = str.length - 1; i >= 0; i-- ) {
            tR.push( str[ i ] );
        }
        return tR.join( "" ); //noom eht revo depmuj woc eht
    }
    function add_function2(operand,display_operand,closer){
        var r_val=display_input.innerHTML;
        var end="";
        var d_end="";
        if (closer!=null){
            end=closer.toString()+")";
            d_end=closer;
        }else{
            close_bracket=true;
            close_bracket_level=br_level;
        }

        if (last_input==enter ){formula="";display_formula.innerHTML="";}
        if (formula.charAt(formula.length - 1) ==")" && br_level==0 && r_val!="0" ){formula="";display_formula.innerHTML="";}

        if (formula.charAt(formula.length - 1)==")"){
            var val1=formula.slice(0,formula.lastIndexOf("("))
            var r_val=formula.slice(formula.lastIndexOf("("))
            formula=val1+operand+r_val+","+end
            var dval1=display_formula.innerHTML.slice(0,display_formula.innerHTML.lastIndexOf("("))
            var dval2=display_formula.innerHTML.slice(display_formula.innerHTML.lastIndexOf("("))
            display_formula.innerHTML=dval1+dval2+display_operand+d_end

            //if expressionm is in brackets then find last opening bracket

            var c=count(formula.slice(formula.lastIndexOf("(")),")");
            var r=GetSubstringIndex(reverseStr(formula),"(",c);
            var i=formula.length-r;
            var val1=formula.slice(0,i-1)
            var r_val=formula.slice(i);
            formula=val1+operand+r_val+","+end

            var c=count(display_formula.innerHTML.slice(display_formula.innerHTML.lastIndexOf("(")),")");
            var r=GetSubstringIndex(reverseStr(display_formula.innerHTML),"(",c);
            var i=display_formula.innerHTML.length-r;
            var val1=display_formula.innerHTML.slice(0,i-1)
            var r_val=display_formula.innerHTML.slice(i);

            display_formula.innerHTML=val1+display_operand+r_val;


        }else{
            formula=formula+operand+r_val+","+end
            display_formula.innerHTML= display_formula.innerHTML+r_val+display_operand+d_end
            display_input.innerHTML = ""


        }
        if (closer!=null){
            precalc(operand+r_val+","+end);
        }
        last_input=operator;
    }
    function add_inv_function(operand,display_operand){
        var r_val=display_input.innerHTML;

        if (last_input==enter){formula="";display_formula.innerHTML="";}
        if (formula.charAt(formula.length - 1) ==")"  && br_level==0 && r_val!="0"){formula="";display_formula.innerHTML="";}

        if (formula.charAt(formula.length - 1)==")"){
            //if expressionm is in brackets then find last opening bracket

            var c=count(formula.slice(formula.lastIndexOf("(")),")");
            var r=GetSubstringIndex(reverseStr(formula),"(",c);
            var i=formula.length-r;
            var val1=formula.slice(0,i-1)
            var r_val=formula.slice(i);
            formula=val1+operand+"("+r_val+")"

            precalc(operand+r_val);

            var c=count(display_formula.innerHTML.slice(display_formula.innerHTML.lastIndexOf("(")),")");
            var r=GetSubstringIndex(reverseStr(display_formula.innerHTML),"(",c);
            var i=display_formula.innerHTML.length-r;
            var val1=display_formula.innerHTML.slice(0,i-1)
            var r_val=display_formula.innerHTML.slice(i);

            display_formula.innerHTML=val1+display_operand+r_val;

        }else{
            formula=formula+operand+r_val+")"
            display_formula.innerHTML= display_formula.innerHTML+display_operand+r_val+")";
            display_input.innerHTML = "0"
            precalc(operand+r_val+")");
        }

        last_input=func;
    }
    this.left_br=left_br;
    function left_br(){
        br_level++;
        //display_input.innerHTML=""
        add_input("(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.right_br=right_br;
    function right_br(){

        //display_input.innerHTML=""
        add_input(")");
        br_level--;
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }

    function is_input_in_bracket(){
        if (display_input.innerHTML.charAt(0) =="(" ) return true;
        return false;
     }
    this.pow=keyboard_pow;
    function keyboard_pow(){
        add_function2("Math.pow(","^");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.pow2=keyboard_pow2;
    function keyboard_pow2(){
        add_function2("Math.pow(","^",2);
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.sqrt=keyboard_sqrt;
    function keyboard_sqrt(){
        add_inv_function("Math.sqrt(","√(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.sin=keyboard_sin;
    function keyboard_sin(){
        add_inv_function("Math.sin(Math.PI / 180*","sin(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.cos=keyboard_cos;
    function keyboard_cos(){
        add_inv_function("Math.cos(Math.PI / 180*","cos(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.tan=keyboard_tan;
    function keyboard_tan(){
        add_inv_function("Math.tan(Math.PI / 180*","tan(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.percent=keyboard_percent;
    function keyboard_percent(){

        //add_function("(0.01*","%");
        if (operator==true){
            display_input.innerHTML=eval(formula)/100*parseFloat(display_input.innerHTML)
        }else{
            display_input.innerHTML=eval(formula+"0")/100*parseFloat(display_input.innerHTML)
        }

        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.ms=keyboard_ms;
    function keyboard_ms(){
        memory=parseFloat(display_input.innerHTML);
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.mp=keyboard_mp;
    function keyboard_mp(){
        memory=memory+parseFloat(display_input.innerHTML);
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }

    this.mr=keyboard_mr;
    function keyboard_mr(){
        display_input.innerHTML=memory.toString();
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }

    this.invert=keyboard_invert;
    function keyboard_invert(){
        add_inv_function("1/(","1/(");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.minus=keyboard_minus;
    function keyboard_minus(){
        add_input("-");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.plus=keyboard_plus;
    function keyboard_plus(){
        add_input("+");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.multiply=keyboard_multiply;
    function keyboard_multiply(){
        add_input("*","x");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.divide=keyboard_divide;
    function keyboard_divide(){
        add_input("/");
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.calc=calc;
    function calc(){
        try{
        display_input.innerHTML=parseFloat(round(eval(formula),12));
            document.getElementById('debug').innerHTML="";
        }catch(e){
            document.getElementById('debug').innerHTML=e+">"+formula+"<"
        }

    }
    this.precalc=precalc;
    function precalc(exp){
        try{
            if (exp!=null){
                display_input.innerHTML=parseFloat(round(eval(exp),12));
            }else{
                display_input.innerHTML=eval(formula)
            }
            document.getElementById('debug').innerHTML="";
        }catch(e){
             //display_input.innerHTML=e+"("+formula+")"
            document.getElementById('debug').innerHTML=e+">"+formula+"<"

        }

    }

    this.enter=keyboard_enter;
    function keyboard_enter(){

        if (operator==true){
            //remove previous operator
            display_formula.innerHTML=display_formula.innerHTML.slice(0,display_formula.innerHTML.length-1)
            formula=formula.slice(0,formula.length-1)
        }


        var r_val=display_input.innerHTML; //remove caret
        var d_r_val=r_val;
        if (display_formula.innerHTML.charAt(display_formula.innerHTML.length - 1) =="=" ){
            //if formula is finished, simply recalculate value!
            calc();
        }else{
            /*if (is_input_in_bracket()){
                if (input_formula.value.charAt(display_formula.innerHTML.length - 1) =="="){

                }
            }

            }else{*/
            if (formula.charAt(formula.length - 1) ==")" ){r_val="";d_r_val="";}

            if (close_bracket==true){
                r_val=r_val+")"
                close_bracket=false;
            }
            /*
            }else if (close_inv_bracket==true){
                    //display_formula.innerHTML=display_formula.innerHTML.toString()+r_val.toString();
                    //close bracket here
                    r_val=")";
                    close_inv_bracket=false;
            }else{
                display_formula.innerHTML=display_formula.innerHTML.toString()+r_val.toString();
            }*/



        formula=formula.toString()+r_val.toString();

        calc();
        display_formula.innerHTML=display_formula.innerHTML.toString()+d_r_val+"=";

            //alert(formula)

        //formula=formula.toString()+"=";
        }
        close_inv_bracket=false;
        close_bracket=false;
        br_level=0;
        last_input=enter;
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
       }

    this.bs=keyboard_bs;
    function keyboard_bs(){

        if (last_input==number){
            var r_val=display_input.innerHTML; //remove caret
            display_input.innerHTML=r_val.substring(0, r_val.length - 1); //remove last char and add caret
            //customKB_unselect()
        }
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.del=keyboard_delete;
    function keyboard_delete(){
        display_input.innerHTML="0"; //
        display_formula.innerHTML="";
        formula="";
        close_bracket=false;
        close_inv_bracket=false;
        br_level=0;
        last_input=nothing;
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
    }
    this.negative=keyboard_negative;

    function keyboard_negative(){
        var r_val=display_input.innerHTML; //remove caret
        if (r_val.substring(0, 1)=="-"){
            //Remove minus
                display_input.innerHTML=r_val.substring(1, r_val.length); //remove minus char
            }else{
            //remove minus
                display_input.innerHTML="-"+r_val; //add minus
            }
                //customKB_unselect()
        if(kb_vibrate) navigator.notification.vibrate(kb_vibrate_time);
	}
    this.resize=resize;
    function resize(){
        //alert(screen.height);
        //document.getElementById(fields.wrapper).style.height=screen.height-getOffset(document.getElementById(fields.wrapper)).top+"px"
    }
    this.keyboard=keyboard;
    function keyboard(evt) {
        evt = evt || window.event;
        //evt.ctrlKey
        //alert(evt.keyCode)
        //document.getElementById('debug').innerHTML=evt.keyCode.toString();
        if (!evt.shiftKey &&(evt.keyCode == 110 || evt.keyCode == 190)) {
            type('.');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 49 || evt.keyCode == 97)) {
            type('1');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 50 || evt.keyCode == 98)) {
            type('2');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 51 || evt.keyCode == 99)) {
            type('3');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 52 || evt.keyCode == 100)) {
            type('4');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 53 || evt.keyCode == 101)) {
            type('5');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 54 || evt.keyCode == 102)) {
            type('6');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 55 || evt.keyCode == 103)) {
            type('7');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 56 || evt.keyCode == 104)) {
            type('8');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 57 || evt.keyCode == 105)) {
            type('9');return;
        }
        if (!evt.shiftKey &&(evt.keyCode == 48 || evt.keyCode == 96)) {
            type('0');return;
        }
        if ((evt.shiftKey && evt.keyCode == 187 )|| evt.keyCode == 107) {
            add_input("+");return;
        }
        if (evt.keyCode == 109 || evt.keyCode == 189) {
            add_input("-");return;
        }
        if ((evt.shiftKey && evt.keyCode == 56 )|| evt.keyCode == 106) {
            add_input("*","x");return;
        }
        if ((evt.shiftKey && evt.keyCode == 191 )|| evt.keyCode == 111) {
            add_input("/");return;
        }
        if (evt.keyCode == 187 || evt.keyCode == 13) {
            keyboard_enter();return false;
        }
        if (evt.keyCode == 83) {
            keyboard_sin();return;
        }
        if (evt.keyCode == 67) {
            keyboard_cos();return;
        }
        if (evt.keyCode == 84) {
            keyboard_tan();return;
        }
        if (evt.keyCode == 82) {
            keyboard_sqrt();return;
        }
        if ((evt.shiftKey && evt.keyCode == 54 )) {
            keyboard_pow2();return;
        }
        if (evt.keyCode == 27 ) {
            keyboard_delete();return;
        }
        if (evt.keyCode == 8 ) {
            keyboard_bs();return false;
        }
        return false;
    }

}