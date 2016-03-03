var serverServices={
	
baseUrl:"http://localhost:3000/",
createAsyncGetRequest:function(request){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", this.baseUrl+request, true);
	return xhttp;
},
createAsyncPostRequest:function(request){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", this.baseUrl+request, true);
		return xmlhttp;
},


getOrders:function(callBackFunction) 
{
	var xhttp=this.createAsyncGetRequest("orders");
	xhttp.send();
	xhttp.onreadystatechange=function(){
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callBackFunction(JSON.parse(xhttp.responseText));
			return true;
		}
		else return false;
	};

},


getItems: function(callBackFunction) {
		var xhttp=this.createAsyncGetRequest("menuItem");
		xhttp.send();
		xhttp.onreadystatechange=function(){
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callBackFunction(JSON.parse(xhttp.responseText));
			return true;
		}
		else return false;
	};

},

cancelOrder:function (orderid,callBackFunction){
	console.log("cancel order id :"+orderid);
		var xhttp=this.createAsyncPostRequest("delorder");
		xhttp.setRequestHeader("Content-Type", "text/plain");
		xhttp.send(JSON.stringify({del:orderid}));
		xhttp.onreadystatechange=function(){
		
		if (!(xhttp.readyState == 4 && xhttp.status == 200)) {
			return;		
		}
		else{
			callBackFunction();
		}

		}	
},

sendorder:function (order,callBackFunction){
	
	var xmlhttp=this.createAsyncPostRequest("addOrder");
	console.log(order);
	xmlhttp.send(JSON.stringify(order));
	xmlhttp.onreadystatechange=function(){
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {		
		callBackFunction();
	}
}


},
getNotifications: function(userid,callBackFunction) {		
		var xhttp = this.createAsyncPostRequest("getNotifications");		
		xhttp.send(JSON.stringify({userId:userid}));		
		xhttp.onreadystatechange=function(){
			if (xhttp.readyState == 4 && xhttp.status == 200) {			
			 	 callBackFunction(JSON.parse(xhttp.responseText));		
				}
			else{
				return ;
			}
		};		
	},
readNotification:function(userid){
		var xhttp = this.createAsyncPostRequest("readNotification");		
		xhttp.send(JSON.stringify({userId:userid}));		
		if (xhttp.readyState == 4 && xhttp.status == 200) {		
			console.log(xhttp.responseText);	
			}		

	}




};