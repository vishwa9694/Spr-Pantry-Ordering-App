var serverServices={

createGetRequest:function(request){

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "http://localhost:3000/"+request, false);
	return xhttp;
},
createPostRequest:function(request){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "http://localhost:3000/"+request, false);
		return xmlhttp;
},


getOrders:function() 
{
	xhttp=this.createGetRequest("orders");
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		console.log(xhttp.responseText);
		return JSON.parse(xhttp.responseText);

	}
	else return null;

},


getItems: function() {
		xhttp=this.createGetRequest("menuItem");
			xhttp.send();
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				 	 return JSON.parse(xhttp.responseText);

			}
			else
				return null;

},
cancelOrder:function (orderid){
	console.log("cancel order id :"+orderid);
		xmlhttp=this.createPostRequest("delorder");
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(JSON.stringify({del:orderid}));
	
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			return true;
		}
		else
		{	return false;
		}	
},

sendorder:function (order){
	
	xmlhttp=this.createPostRequest("yoyo");
	console.log(order);
	xmlhttp.send(JSON.stringify(order));


},
getNotifications: function(userid) {		
		var xhttp = this.createPostRequest("getNotifications");		
		xhttp.send(JSON.stringify({userId:userid}));		
		if (xhttp.readyState == 4 && xhttp.status == 200) {		
			console.log(xhttp.responseText);	
		 	  return JSON.parse(xhttp.responseText);		
			}		
	},
readNotification:function(userid){
		var xhttp = this.createPostRequest("readNotification");		
		xhttp.send(JSON.stringify({userId:userid}));		
		if (xhttp.readyState == 4 && xhttp.status == 200) {		
			console.log(xhttp.responseText);	
		 	 // return JSON.parse(xhttp.responseText);		
			}		

	}




};