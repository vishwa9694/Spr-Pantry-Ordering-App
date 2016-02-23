var orderQueueController = {
	getOrders: function(){
		console.log("Called:",orders);
		return orders;
	},

	init: function(){
		orderQueueView.init();
	}
};

var itemListController = {
	getItems: function(){
		return items;
	},

	init: function(){
		itemListView.init();
	}
};

var headerController = {
	init: function(){
		headerView.init();
	}
}

var notificationsController = {
	init: function(){
		console.log("Hello");
        this.getNotificationsFromServer();
		notificationsView.init();
	},
	getNotifications: function(){
		return notifications;
	},
    getNotificationsFromServer: function() {		
		var xhttp = new XMLHttpRequest();		
//		console.log("Hello");		
		//xhttp.onreadystatechange = function() {		
			console.log("USERID:",user);		
			xhttp.open("POST", "http://localhost:3000/getNotifications", false);		
			xhttp.send(JSON.stringify({userId: user.id}));		
			if (xhttp.readyState == 4 && xhttp.status == 200) {		
				console.log(xhttp.responseText);		
				 	 notifications = JSON.parse(xhttp.responseText);		
			}		
	},
	setTrue: function(){
		notifications.forEach(function(noti){
			if(!noti.read){
				noti.read = true;
			}
		});
	}
}


function cancelOrder(order){
	console.log(order);
	console.log("Hello");
	delitem=order.parentNode.parentNode;
	console.log(delitem.childNodes[2]);
	if(delitem.childNodes[2].className==="s-q__status--Queued")
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "http://localhost:3000/delorder", true);
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		console.log(delitem.id);
		xmlhttp.send(JSON.stringify({del:delitem.id}));

		delitem.parentNode.removeChild(delitem);

	}
	else
		alert("Too late");


}
function sendorder(){
	console.clear();
	console.log("Here");


	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "http://localhost:3000/yoyo", false);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");

	/*
	"orderName": "Vishwa",
		"table": 9,
		"itemName": "Cornflakes",
		"quantity": 1,
		"itemDescription": "cold",
	*/
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
	//	console.log(item);
console.log("_____________");
	console.log(order);
	xmlhttp.send(JSON.stringify(order));


}


var controller = {
	init: function() {
		this.getOrdersFromServer();
		orderQueueController.init();
		itemListController.init();
		headerController.init();
		notificationsController.init();
	},

	getOrdersFromServer: function(){
		
		var xhttp = new XMLHttpRequest();
//		console.log("Hello");
		//xhttp.onreadystatechange = function() {
		xhttp.open("GET", "http://localhost:3000/orders", false);
		xhttp.send();
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			console.log(xhttp.responseText);

			orders = JSON.parse(xhttp.responseText);
			console.log("received:",orders);
		}

	}
};

//controller.init();
