//ajax Logic
			//<![CDATA[
				//##################################################################################
				//## FORM SUBMIT WITH AJAX                                                        ##
				//## @Author: Simone Rodriguez aka Pukos <http://www.SimoneRodriguez.com>         ##
				//## @Version: 1.2                                                                ##
				//## @Released: 28/08/2007                                                        ##
				//## @License: GNU/GPL v. 2 <http://www.gnu.org/copyleft/gpl.html>                ##
				//##################################################################################
				function xmlhttpPost(strURL,formname,responsediv,responsemsg) {
					var xmlHttpReq = false
					var self = this
					// Xhr per Mozilla/Safari/Ie7
					if (window.XMLHttpRequest) {
						self.xmlHttpReq = new XMLHttpRequest()
					}
					// per tutte le altre versioni di IE
					else if (window.ActiveXObject) {
						self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP")
					}
					self.xmlHttpReq.open('POST', strURL, true)
					self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
							self.xmlHttpReq.onreadystatechange =function() {
								if (self.xmlHttpReq.readyState == 4) {
									// Quando pronta, visualizzo la risposta del form
									document.getElementById(responsediv).innerHTML = "";
									updatepage_xml(self.xmlHttpReq.responseXML)
									//AFTER updating main window, update myCut DB window
								
									document.fswizardform.ajax.value=2;
									httpPost(strURL,formname,'calc_log',"")
									
								}else if(responsemsg){
									document.getElementById(responsediv).innerHTML = responsemsg;
								}
							}
					self.xmlHttpReq.send(getquerystring(formname))
				}
				function httpPost(strURL,formname,responsediv,responsemsg) {
					var xmlHttpReq = false
					var self = this
					// Xhr per Mozilla/Safari/Ie7
					if (window.XMLHttpRequest) {
						self.xmlHttpReq = new XMLHttpRequest()
					}
					// per tutte le altre versioni di IE
					else if (window.ActiveXObject) {
						self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP")
					}
					self.xmlHttpReq.open('POST', strURL, true)
					self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
					self.xmlHttpReq.onreadystatechange =function() {
								if (self.xmlHttpReq.readyState == 4) {
									// Quando pronta, visualizzo la risposta del form
									//document.getElementById(responsediv).innerHTML = "";
									document.getElementById(responsediv).innerHTML = self.xmlHttpReq.responseText;
								}else if(responsemsg){
									//document.getElementById(responsediv).innerHTML = responsemsg;
								}
							}
					self.xmlHttpReq.send(getquerystring(formname))
							
				}
				
				function getquerystring(formname) {
					var form = document.forms[formname]
					var qstr = ""

					function GetElemValue(name, value) {
						qstr += (qstr.length > 0 ? "&" : "")
							+ escape(name).replace(/\+/g, "%2B") + "="
							+ escape(value ? value : "").replace(/\+/g, "%2B")
							//+ escape(value ? value : "").replace(/\n/g, "%0D")
					}
					
					var elemArray = form.elements
					for (var i = 0; i < elemArray.length; i++) {
						var element = elemArray[i]
						var elemType = element.type
						var elemName = element.name
						
						if (elemName && elemType) {
						elemType=elemType.toUpperCase()
							if (elemType == "TEXT"
									|| elemType == "TEXTAREA"
									|| elemType == "PASSWORD"
									|| elemType == "BUTTON"
									|| elemType == "RESET"
									|| elemType == "SUBMIT"
									|| elemType == "FILE"
									|| elemType == "IMAGE"
									|| elemType == "HIDDEN")
								GetElemValue(elemName, element.value)
							else if (elemType == "CHECKBOX" && element.checked)
								GetElemValue(elemName, 
									element.value ? element.value : "On")
							else if (elemType == "RADIO" && element.checked)
								GetElemValue(elemName, element.value)
							else if (elemType.indexOf("SELECT") != -1)
								for (var j = 0; j < element.options.length; j++) {
									var option = element.options[j]
									if (option.selected)
										GetElemValue(elemName,
											option.value ? option.value : option.text)
								}
						}
					}
					return qstr
				}
				function updatepage(str,responsediv){
					document.getElementById(responsediv).innerHTML = str
					tabs_init('tab_1');
					}
			function getNodeText(node) {
				var r = "";
				for (var x = 0;x < node.childNodes.length; x++) {
					r = r + node.childNodes[x].nodeValue;
				}
				return r;
			}

			function updatepage_xml(xmlDoc,responsediv){
					
									var x=xmlDoc.getElementsByTagName("field");
									var xl=x.length;
				// Get active element of the form
									var activeelement=document.activeElement; 
									var t="";
									var nodename="";
									var nodevalue="";
									var value=""
									var elemtype="";
									var style="";
									var stylevalue="";
									var hrefvalue="";
									var dump="";
				//var y=document.getElementsByTagName('*');
				//var yl=y.length;
									var y=new Array();
						var y0=document.getElementsByTagName('*');
						var y0l=y0.length;
						for (j=0;j<y0l;j++)
							{
							if (y0[j].getAttribute("name"))
								{
									y.push(y0[j]);
								}
							}	
							var yl=y.length;

				///////////////////Cycle through xml elements  && update 
									
				for (i=0;i<xl;i++)
				  {
					nodename=x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					try {
						style=x[i].getElementsByTagName("style")[0].childNodes[0];
						if( typeof (style.nodeValue) == "undefined" )stylevalue=""; else stylevalue=style.nodeValue
					}catch(err){
						stylevalue="";
					}
					try {
						var href=x[i].getElementsByTagName("href")[0].childNodes[0];
						if( typeof (href.nodeValue) == "undefined" )hrefvalue=""; else hrefvalue=href.nodeValue
					}catch(err){
						hrefvalue="";
					}
					try {
						value=x[i].getElementsByTagName("value")[0].childNodes[0];
						if( typeof (value.nodeValue) == "undefined" )nodevalue="";else nodevalue=getNodeText(x[i].getElementsByTagName("value")[0]);
						//alert(nodename+" "+value.nodeType+" "+value.nodeValue);
					}catch(err){
						nodevalue="";
					}
					//if (document.getElementById(nodename)){
					if (document.getElementById(nodename) && document.getElementById(nodename)!==activeelement){
						elemtype=document.getElementById(nodename).type;
						element=document.getElementById(nodename);
						if (!elemtype){
							element.innerHTML =nodevalue;
						}else{
							element.value =nodevalue;
						}
						if (stylevalue)element.style.cssText=stylevalue;
						element.href=hrefvalue;
					}
						//var y=document.getElementsByTagName('span');
					
						for (j=0;j<yl;j++)
							{
							if (y[j].getAttribute("name")==nodename)
								{
									elemtype=y[j].type;
									if (!elemtype){
										y[j].innerHTML =nodevalue;
									}else{
										y[j].value =nodevalue;
									}
									if (stylevalue)y[j].style.cssText=stylevalue;
									if (hrefvalue)y[j].href=hrefvalue;

								}
							}	
						
				  }		
				// alert(dump);
				}

