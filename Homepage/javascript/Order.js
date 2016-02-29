var modelOrder={
init:function(){
	this.order=serverServices.getOrders();
}
};



var controllerQueue={

renderQueue:function(){
	console.log("this is model order "+modelOrder.order);
	viewQueue.init();
	var displaycancel=false;
	if(!(modelOrder.order===null||modelOrder.order===undefined))
	{
		modelOrder.order.forEach(function(orderItem,index){
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
			modelOrder.order.forEach(function(orderitem){
				console.log(orderitem.orderId+" "+cancelrequest);
				if(orderitem.orderId===cancelrequest)
					orderitem.status="Cancelled";
			});
			console.log(modelOrder.order);
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
		this.addEventListener();
	},

	addEventListener: function(){
		var tableEl = document.getElementById("orderTable");
		tableEl.onclick = function(event){
		event = event || window.event;
            var target = event.target;
			console.log("delete:"+target.id.split("_")[1]);
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		}
	},

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
	}
};


