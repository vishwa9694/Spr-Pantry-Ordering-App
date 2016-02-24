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

},
getItems: function() {
		xhttp=this.createGetRequest("menuItem");
			xhttp.send();
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				 	 return JSON.parse(xhttp.responseText);

			}

},
cancelOrder:function (order){
	console.log(order);
	console.log("Hello");
	delitem=order.parentNode.parentNode;
	console.log(delitem.childNodes[2]);
	if(delitem.childNodes[2].className==="s-q__status--Queued")
	{
		xmlhttp=this.createPostRequest("delorder");
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		console.log(delitem.id);
		xmlhttp.send(JSON.stringify({del:delitem.id}));

		delitem.parentNode.removeChild(delitem);

	}
	else
		alert("Too late");


},

sendorder:function (){
	console.clear();
	console.log("Here");

	xmlhttp=this.createPostRequest("yoyo");
	var order=new Array();

	tabl=document.getElementsByClassName("s-o-e__table")[0];
	var count=tabl.childElementCount;

	for(child=tabl.childNodes[2];count;count--){
		order[count-1]=new Object();

		console.log(child.getElementsByClassName("item__name")[0].childNodes[1]);
		order[count-1].uid=user.id;
		order[count-1].orderName=user.name;
		order[count-1].itemName=child.getElementsByClassName("item__name")[0].childNodes[1].innerHTML;
		order[count-1].table=document.getElementById("user-table").value;
		order[count-1].quantity=child.getElementsByClassName("item-qty")[0].innerHTML;
		order[count-1].itemDescription=child.getElementsByClassName("in_comment")[0].value;

		console.log(order[count-1]);
		child=child.nextSibling;
	}
	console.log("_____________");
	console.log(order);
	xmlhttp.send(JSON.stringify(order));


},
getNotifications: function() {		
		var xhttp = this.createPostRequest("getNotifications");		
		xhttp.send(JSON.stringify({userId: user.id}));		
		if (xhttp.readyState == 4 && xhttp.status == 200) {		
			console.log(xhttp.responseText);	
		 	 notifications = JSON.parse(xhttp.responseText);		
			}		
	}



};