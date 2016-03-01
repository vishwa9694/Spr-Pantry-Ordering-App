var serverServices={
	
baseUrl:"http://localhost:3000/",
/*
createGetRequest:function(request){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", this.baseUrl+request, false);
	return xhttp;
},
createPostRequest:function(request){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", this.baseUrl+request, false);
		return xmlhttp;
},
*/
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


getOrders:function(setOrder,callBackFunction) 
{
	var xhttp=this.createAsyncGetRequest("orders");
	xhttp.send();
	xhttp.onreadystatechange=function(){
		console.log("State Changed For Orders");
		if (xhttp.readyState == 4 && xhttp.status == 200) {
		
			console.log(xhttp.responseText);
			setOrder(xhttp.responseText);
//			alert("Service Calling Render NOw");
			callBackFunction();
			return true;
		}
		else return false;
	};

},


getItems: function(setItem,callBackFunction) {
		var xhttp=this.createAsyncGetRequest("menuItem");
		xhttp.send();
		xhttp.onreadystatechange=function(){
		console.log("Item State Changed");
		if (xhttp.readyState == 4 && xhttp.status == 200) {
		
			console.log(xhttp.responseText);
			setItem(xhttp.responseText);
			callBackFunction();
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
			
			//alert("Server Cancel Order Eror");
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
		//alert("Order Submitted Calling Back");
		callBackFunction();
	}
}


},
getNotifications: function(userid,setNotification,callBackFunction) {		
		var xhttp = this.createAsyncPostRequest("getNotifications");		
		xhttp.send(JSON.stringify({userId:userid}));		
		xhttp.onreadystatechange=function(){
			console.log(xhttp.responseText);
			if (xhttp.readyState == 4 && xhttp.status == 200) {		
				console.log(xhttp.responseText);	
			 	 setNotification(xhttp.responseText);
			 	 callBackFunction();		
				}
			else{
				//alert("Server Notifications Error");
			}
			};		
	},
readNotification:function(userid){
		var xhttp = this.createAsyncPostRequest("readNotification");		
		xhttp.send(JSON.stringify({userId:userid}));		
		if (xhttp.readyState == 4 && xhttp.status == 200) {		
			console.log(xhttp.responseText);	
		 	 // return JSON.parse(xhttp.responseText);		
			}		

	}




};