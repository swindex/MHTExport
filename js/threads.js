function trim_nulls(data) {
  var y;
  for (var x in data) {
    y = data[x];
    if (y==="null" || y===null || y==="" || typeof y === "undefined" || (y instanceof Object && Object.keys(y).length == 0)) {
      delete data[x];
    }
    if (y instanceof Object) y = trim_nulls(y);
  }
  return data;
}

function XML_Get_Table (XML_text,table_name){
    if (is_IE()){
        var xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.loadXML(XML_text);
    }else{
        var parser=new DOMParser();
        var xml =parser.parseFromString(XML_text,'text/xml');
    }


		var table = [];
		var n=0;
		var ok=0;
		var rows = xml.getElementsByTagName(table_name);
		for (i=0;i<rows.length;i++){
			var nodes = rows[i].childNodes;
			if (nodes.length>1){
				
					table[n]={}
					for (ii=0;ii<nodes.length;ii++){  
					   if (is_IE()==true) table[n][rows[i].childNodes[ii].nodeName]=rows[i].childNodes[ii].childNodes[0].nodeValue;
                        else
                       table[n][rows[i].childNodes[ii].nodeName]=rows[i].childNodes[ii].textContent;
					}
				n++;
				}

			}
		
		return table;
	}
function DB_Get_Rows_Where (dbtable,callback,params){
		var table = new Array();
		var n=0;
		var ok=0;
		
		for (var key1 in dbtable){
				
				//check if out row using callback
				
				if (callback(dbtable[key1],params)) ok=1; else ok=0;
				
				if (ok==1){
					//copy all fields into our array
					table[n]={}
					for(var key2 in dbtable[key1]) {
						table[n][key2]={}
						table[n][key2]=dbtable[key1][key2]
					}
					n++;
				}

			
		}
		return table;
	}
	
	
function DB_Get_Rows (dbtable,where_field,where_value,where_field2,where_value2){
		var table = new Array();
		var n=0;
		var ok=0;
		
		for (var key1 in dbtable){
				if (typeof where_field !="undefined" && typeof where_value != "undefined" ){
					if (typeof dbtable[key1][where_field]!="undefined"){
						if (dbtable[key1][where_field]==where_value)ok=1;else ok=0;
					}
				}
				if (typeof where_field2 !="undefined" && typeof where_value2 != "undefined" ){
					if (typeof dbtable[key1][where_field2]!="undefined"){
						if (dbtable[key1][where_field2]==where_value2)ok=1;else ok=0;
					}
				}
				
				if (ok==1){
					//copy all fields into our array
					table[n]={}
					for(var key2 in dbtable[key1]) {
						table[n][key2]={}
						table[n][key2]=dbtable[key1][key2]
					}
					n++;
				}

			
		}
		return table;
	}
function Calc_Thread_Drill_Dia(Thread,thread_pc){
	return X_Y_Delta(100, 0, Thread.MINOR_Dia, Thread.MAJOR_Dia, thread_pc) 
}
function Calc_Thread_Info(tform, tsize,forming , return_Metric) {
        
        var tform_row = {};

        var Thread = {};

        var pitch  = 0
        var unit  = 1
        var unit_m  = 1

        Thread.form = tform
        Thread.Size = tsize
        Thread.Form_metric = return_Metric


        if (return_Metric){
			unit = 25.4
            unit_m = 25.4
        }else{
            unit = 1
        }

        //var DV1 As New DataView(DS_threads.Tables("form"), "name='" & tform & "'", "", DataViewRowState.CurrentRows)
				
        tform_row =DB_Get_Rows(db.threads.forms,"name",tform)[0];
		
		//If DV1.ToTable.Rows.Count > 0 Then tform_row = DV1.ToTable.Rows.Item(0)
        //If tform_row Is Nothing Then Exit Function



        //var DV As New DataView(DS_threads.Tables("thread"), "form='" & tform & "' AND size='" & tsize & "'", "", DataViewRowState.CurrentRows)
       // 'populate_thread_class_list(CMB_Thread_Class, DT_Get_Unique_Rows(DV.ToTable, "class"))

	   thread = DB_Get_Rows(db.threads.threads,"form",tform,"size",tsize)[0];
		
        //var TD As DataTable = DV.ToTable




        if (typeof thread !="undefined" && typeof tform_row !="undefined"){

          /*  if (return_Metric == 1 && unit == 25.4 ){
                unit_m = 1
            }
            if (return_Metric == 1 && unit == 1) {
                unit_m = 1 / 25.4
            }
*/
if (typeof thread.major_dia == "undefined" && typeof thread.allowance != "undefined") thread.major_dia=parseFloat(thread.major_dia_max)+parseFloat(thread.allowance);
           
            if (tform_row.metric !=1){
                Thread.Pitch = 1 / thread.pitch// '* unit_m
                Thread.MAJOR_Dia = thread.major_dia
            }else{
                Thread.Pitch = thread.pitch / 25.4
                Thread.MAJOR_Dia = thread.major_dia / 25.4
			}
            
          
           //Show tapping info


            if (forming != 1) {
                Thread.Thread_PC_Best = tform_row.drill_thread_pc_cutting
                Thread.Drill_Factor = tform_row.drill_factor_cutting
            }else{
                Thread.Thread_PC_Best = tform_row.drill_thread_pc_forming
                Thread.Drill_Factor = tform_row.drill_factor_forming
            }
            Thread.MINOR_Dia = Thread.MAJOR_Dia - Thread.Drill_Factor * Thread.Pitch
            Thread.Drill_Dia = X_Y_Delta(100, 0, Thread.MINOR_Dia, Thread.MAJOR_Dia, Thread.Thread_PC_Best) * unit_m

            return Thread
        }




}