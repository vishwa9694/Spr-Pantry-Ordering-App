var modelOrder={

init:function(callBackFunction){
//	this.orders=[];
	serverServices.getOrders((this.setOrders.bind(this)),callBackFunction);
},
getOrders:function(){
	return this.orders;
},
setOrders:function(orders){
//	this.orders=[];
	
	this.orders=JSON.parse(orders);
	console.log("Orders are "+this.orders);
	this.orders.forEach(function(orderitem){console.log(orderitem);})
}
};



var controllerQueue={
init:function(){
	console.log("Re rendering the queue");
	viewQueue.init();
	viewQueue.ordertableReset();
	modelOrder.init((this.renderQueue.bind(this)));
},

renderQueue:function(){
	console.log("This is orders "+modelOrder.getOrders());
	var displaycancel=false;
	
	if(!(modelOrder.getOrders()===null||modelOrder.getOrders()===undefined))
	{
		modelOrder.getOrders().forEach(function(orderItem,index){
		console.log("uid:"+orderItem.uid+" loginid:"+login.user.id);
		if(orderItem.uid===login.user.id&&orderItem.status==="Queued")
			displaycancel=true;
		console.log(displaycancel);
		var order = new controllerQueue.addOrderConstructor(orderItem, displaycancel);
		viewQueue.addOrder(order);
		displaycancel=false;
	});
	}
	else
	{
		console.log("No Object man");
	//	viewQueue.orderEmpty();
	}
	},


deleteOrder:function(cancelrequest){
		cancelrequest=parseInt(cancelrequest);
		var serviceret=serverServices.cancelOrder(cancelrequest,this.init.bind(this));
	/*	if(serviceret===true)
		{
			modelOrder.getOrders().forEach(function(orderitem){
				console.log(orderitem.orderId+" "+cancelrequest);
				if(orderitem.orderId===cancelrequest)
					orderitem.status="Cancelled";
			});
			console.log(modelOrder.getOrders());
			viewQueue.ordertableReset();
						
		}
		else
		{
			console.log("fjan");
		}*/

	},

addOrderConstructor: function(order, displaycancel){
	this.personName = order.orderName;
	this.itemName = order.itemName;
	this.status = order.status;
	this.orderID = order.orderId;
	this.userID = order.uid;
	this.displaycancel = displaycancel;
}	


};


var viewQueue = {
	init: function(){
		orderTableDivEl = document.getElementById("orderTableDiv");
		ordertableEl = document.getElementById("orderTable");
		//this.addEventListener();
	},

	// addEventListener: function(){
	// 	var tableEl = document.getElementById("orderTable");
	// 	tableEl.onclick = function(event){
	// 	event = event || window.event;
 //            var target = event.target;
	// 		console.log("delete:"+target.id.split("_")[1]);
	// 		controllerQueue.deleteOrder(target.id.split("_")[1]);
	// 	}
	// },

	orderRowInnerHTML: function(personName, itemName, status, orderID,displaycancel){
		console.log("cancel button:"+displaycancel);
		if(displaycancel)
			return '<td class="s-q__name"><i class="fa fa-times-circle fa-lg" id="cancel_'+orderID+'" ></i><span>'+ personName+'<span></td><td class="s-q__item">' + itemName + '</td><td class="s-q__status--'+status+'">'+status+' </td>';
		else
			return '<td class="s-q__name"><span>'+ personName+'<span></td><td class="s-q__item">' + itemName + '</td><td class="s-q__status--'+status+'">'+status+' </td>';			
	},

	addOrder: function(order){
		rowEl = document.createElement("tr");
		rowEl.innerHTML = viewQueue.orderRowInnerHTML(order.personName, order.itemName, order.status,order.orderID,order.displaycancel);
		rowEl.setAttribute('class', 's-q-e__item '+order.userID);
		rowEl.setAttribute('id', order.orderID);
		ordertableEl.appendChild(rowEl);
		
	},

	ordertableReset: function(){
		var orderTableDivEl = document.getElementById("orderTableDiv");
		orderTableDivEl.innerHTML = " ";
		ordertableEl = document.createElement("table");
		ordertableEl.innerHTML = '<tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr>';
		ordertableEl.setAttribute('class','s-q__table');
		ordertableEl.setAttribute('id', 'orderTable');
		orderTableDivEl.appendChild(ordertableEl);
		ordertableEl.onclick = function(event){
			event = event || window.event;
            var target = event.target;
			console.log("delete:"+target.id.split("_")[1]);
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		};	
	}
};


