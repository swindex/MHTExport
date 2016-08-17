//triangle
			var useOrder=new Array();
			var useDegrees = true;
				
				function sasGetSide3(side1, angle1, side2){
					if (useDegrees) angle1 = deg2rad(angle1);
					return Math.sqrt(side1 * side1 + side2 * side2 - 2 * side1 * side2 * Math.cos(angle1));
				}

				function sssGetAngle2(side1, side2, side3){
					var angle = Math.acos((side2 * side2 + side3 * side3 - side1 * side1)/(2 * side2 * side3));
					if (useDegrees) return rad2deg(angle);
					else return angle;
				}

				function aaGetAngle3(angle1, angle2){
					if (useDegrees) return 180 - angle1 - angle2;
					else return Math.PI  - angle1 - angle2;
				}

				function asaGetSide2(angle1, side1, angle2){
					if (useDegrees) angle1 = deg2rad(angle1);
					if (useDegrees) angle2 = deg2rad(angle2);
					return side1 * (Math.sin(angle1)) / (Math.sin(angle2));
				}

				function ssaGetAngle2(side1,side2,angle1){
					if (useDegrees) angle1 = deg2rad(angle1);
					var angle = Math.asin(side2 * Math.sin(angle1) / side1);
					if (useDegrees) return rad2deg(angle);
					else return angle;
				}

			function calc_triangle(){
			//pool all of the numbers
			current_parent="panel_triangle_calc";
			var mask="";
			var erro="";
				var a=  document.getElementById("triangle_angle_a").value;		
				var b=  document.getElementById("triangle_angle_b").value;		
				var c=  document.getElementById("triangle_angle_c").value;		
				var ab= document.getElementById("triangle_side_ab").value;		
				var bc= document.getElementById("triangle_side_bc").value;		
				var ca= document.getElementById("triangle_side_ca").value;		
				
				/*var a= tpl['triangle']['angle']['a'];
				var b= tpl['triangle']['angle']['b'];
				var c= tpl['triangle']['angle']['c'];
				var ab=tpl['triangle']['side']['ab'];
				var bc=tpl['triangle']['side']['bc'];
				var ca=tpl['triangle']['side']['ca'];
				*/
				
				
				mask= triangle_generate_mask();
				switch (mask){

					case "a_ab_ca":{
						// SAS
						bc = sasGetSide3(ca,a,ab);
						b = sssGetAngle2(ca,ab,bc);			
						c = aaGetAngle3(a,b);
					} break;
					case "bc_c_ca":{
						// SAS
						ab = sasGetSide3(ca,c,bc);
						a = sssGetAngle2(bc,ca,ab);
						b = aaGetAngle3(c,a);
					} break;
					case "ab_b_bc":{
						// SAS
						ca = sasGetSide3(bc,b,ab);
						c = sssGetAngle2(ab,bc,ca);
						a = aaGetAngle3(b,c);

					} break;
					case "ab_bc_ca":{
						// SSS
						if (ab+bc<=ca || ca+ab<=bc || bc+ca<=ab){
						erro='Entered values cannot make a triangle.  The sum of lengths of any two sides must exceed the length of the third side';
						}
						c = sssGetAngle2(ab,bc,ca);		
						b = sssGetAngle2(ca,ab,bc);		
						a = sssGetAngle2(bc,ca,ab);
						
					} break;
					case "a_ab_b":{
						// ASA
						c = aaGetAngle3(b,a);
						ca = asaGetSide2(b,ab,c);
						bc = asaGetSide2(a,ab,c);
					} break;
					case "a_c_ca":{
						// ASA
						b = aaGetAngle3(a,c);
						bc = asaGetSide2(a,ca,b);
						ab = asaGetSide2(c,ca,b);
					} break;
					case "b_bc_c":{
						// ASA
						a = aaGetAngle3(c,b);
						ab = asaGetSide2(c,bc,a);
						ca = asaGetSide2(b,bc,a);
					} break;
					case "a_b_bc":{
						// AAS
						c = aaGetAngle3(b,a);
						ab = asaGetSide2(c,bc,a);
						ca = asaGetSide2(b,bc,a);
					} break;
					case "a_b_ca":{
						// AAS
						c = aaGetAngle3(b,a);
						bc = asaGetSide2(a,ca,b);
						ab = asaGetSide2(c,ca,b);
					} break;
					case "a_ab_c":{
						// AAS
						b = aaGetAngle3(a,c);
						ca = asaGetSide2(b,ab,c);
						bc = asaGetSide2(a,ab,c);
					} break;
					case "a_bc_c":{
						// AAS
						b = aaGetAngle3(a,c);
						ab = asaGetSide2(c,bc,a);
						ca = asaGetSide2(b,bc,a);
					} break;
					case "c_ca_b":{
						// AAS
						a = aaGetAngle3(c,b);
						bc = asaGetSide2(a,ca,b);
						ab = asaGetSide2(c,ca,b);
					} break;
					case "ab_b_c":{
						// AAS
						a = aaGetAngle3(c,b);
						ca = asaGetSide2(b,ab,c);
						bc = asaGetSide2(a,ab,c);
					} break;
					case "ab_b_ca":{
						// SSA
						c = ssaGetAngle2(ca,ab,b);
						a = aaGetAngle3(c,b);
						bc = sasGetSide3(ca,a,ab);
					} break;		
					case "ab_c_ca":{
						// SSA
						b = ssaGetAngle2(ab,ca,c);
						a = aaGetAngle3(b,c);
						bc = sasGetSide3(ab,a,ca);
					} break;
					case "a_bc_ca":{
						// SSA
						b = ssaGetAngle2(bc,ca,a);
						c = aaGetAngle3(b,a);
						ab = sasGetSide3(bc,c,ca);
					} break;		
					case "b_bc_ca":{
						// SSA
						a = ssaGetAngle2(ca,bc,b);
						c = aaGetAngle3(a,b);
						ab = sasGetSide3(ca,c,bc);
					} break;
					case "ab_bc_c":{
						// SSA
						a = ssaGetAngle2(ab,bc,c);
						b = aaGetAngle3(a,c);
						ca = sasGetSide3(ab,b,bc);
					} break;		
					case "a_ab_bc":{
						// SSA
						c = ssaGetAngle2(bc,ab,a);
						b = aaGetAngle3(c,a);
						ca = sasGetSide3(bc,b,ab);
					} break;
					default:
					erro="Not enoguh data entered";
					
				}
				editElementByName("mask","innerHTML",mask);
				editElementByName("triangle_error","innerHTML",erro);
				document.getElementById("triangle_angle_a").value =	round(a,2)
				document.getElementById("triangle_angle_b").value =	round(b,2)
				document.getElementById("triangle_angle_c").value =	round(c,2)
				document.getElementById("triangle_side_ab").value =	round(ab,4)
				document.getElementById("triangle_side_bc").value =	round(bc,4)
				document.getElementById("triangle_side_ca").value = round(ca,4)
				
				
			}
			function triangle_use_this(self){
				self.style.backgroundColor="#CCFFCC";
				if (useOrder.lastIndexOf(self.id)<0)useOrder.push(self.id);
				if (useOrder.length>3)document.getElementById(useOrder.shift()).style.backgroundColor="white";
				triangle_clear_result()
			}	
			function triangle_use_reset(){
				var ms=""
				for (var k in useOrder){
				ms=useOrder[k];
					document.getElementById(ms).style.backgroundColor="white";
				}
				useOrder=[];
			}	
			function triangle_clear_all(){
				document.getElementById("triangle_angle_a").value =	"" 
				document.getElementById("triangle_angle_b").value =	"" 
				document.getElementById("triangle_angle_c").value =	"" 
				document.getElementById("triangle_side_ab").value =	""
				document.getElementById("triangle_side_bc").value =	""
				document.getElementById("triangle_side_ca").value = ""
				triangle_use_reset();
			}
			function triangle_clear_result(){
				if (useOrder.lastIndexOf("triangle_angle_a")==-1)document.getElementById("triangle_angle_a").value ="";
				if (useOrder.lastIndexOf("triangle_angle_b")==-1)document.getElementById("triangle_angle_b").value ="";
				if (useOrder.lastIndexOf("triangle_angle_c")==-1)document.getElementById("triangle_angle_c").value ="";
				if (useOrder.lastIndexOf("triangle_side_ab")==-1)document.getElementById("triangle_side_ab").value ="";
				if (useOrder.lastIndexOf("triangle_side_bc")==-1)document.getElementById("triangle_side_bc").value ="";
				if (useOrder.lastIndexOf("triangle_side_ca")==-1)document.getElementById("triangle_side_ca").value ="";
			}
			function triangle_generate_mask(){
			var mask=new Array();
			var ms=""
			
				for (var k in useOrder){
				ms=useOrder[k];
					if (document.getElementById(ms).name=="angle_a") mask.push("a");
					if (document.getElementById(ms).name=="side_ab") mask.push("ab");
					
					if (document.getElementById(ms).name=="angle_b") mask.push("b");
					if (document.getElementById(ms).name=="side_bc") mask.push("bc");
					
					if (document.getElementById(ms).name=="angle_c") mask.push("c");
					if (document.getElementById(ms).name=="side_ca") mask.push("ca");
				}
				mask.sort();
				return mask.join("_");
			}
