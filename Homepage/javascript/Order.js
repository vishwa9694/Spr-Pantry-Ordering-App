var modelOrder={

init:function(callBackFunction){
	this.orders=[];
	serverServices.getOrders((this.setOrders.bind(this)),callBackFunction);
},
getOrders:function(){
	return this.order;
},
setOrders:function(orders){
	this.order=JSON.parse(orders);
	console.log("Orders are "+this.orders);
	this.orders.forEach(function(orderitem){console.log(orderitem);})
}
};



var controllerQueue={
init:function(){
	modelOrder.init((this.renderQueue.bind(this)));
	viewQueue.init();
	viewQueue.ordertableReset();
},

renderQueue:function(){
	console.log(modelOrder.getOrders());
	
	//viewQueue.init();
	//viewQueue.ordertableReset();

	var displaycancel=false;
	if(!(modelOrder.getOrders()===null||modelOrder.getOrders()===undefined))
	{
		modelOrder.getOrders().forEach(function(orderItem,index){
		console.log("uid:"+orderItem.uid+" loginid:"+login.user.id);
		if(orderItem.uid===login.user.id)
			displaycancel=true;
		console.log(displaycancel);
		viewQueue.addOrder(orderItem.orderName,orderItem.itemName,orderItem.status,orderItem.orderId,orderItem.uid,displaycancel);
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
		var serviceret=serverServices.cancelOrder(cancelrequest);
		if(serviceret===true)
		{
			modelOrder.getOrders().forEach(function(orderitem){
				console.log(orderitem.orderId+" "+cancelrequest);
				if(orderitem.orderId===cancelrequest)
					orderitem.status="Cancelled";
			});
			console.log(modelOrder.getOrders());
			viewQueue.ordertableReset();
			this.renderQueue();			
		}
		else
		{
			console.log("fjan");
		}

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

	addOrder: function(personName, itemName, status, orderID, userID,displaycancel){
		rowEl = document.createElement("tr");
		rowEl.innerHTML = viewQueue.orderRowInnerHTML(personName, itemName, status,orderID,displaycancel);
		rowEl.setAttribute('class', 's-q-e__item '+userID);
		rowEl.setAttribute('id', orderID);
		ordertableEl.appendChild(rowEl);
		
	},

	ordertableReset: function(){
		orderTableDivEl.innerHTML = " ";
		ordertableEl = document.createElement("table");
		ordertableEl.innerHTML = '<tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr>';
		ordertableEl.setAttribute('class','s-q__table');
		ordertableEl.setAttribute('id', 'orderTable');
		orderTableDivEl.appendChild(ordertableEl);
		ordertableEl.onclick = function(e){
			//console.log("asdasd");
			//e = e || event;
			var target = e.target;
			console.log("delete:"+target.id.split("_")[1]);
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		};	
	}
};


