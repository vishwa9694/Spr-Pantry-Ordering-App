var modelOrder={
init:function(){
	this.order=serverServices.getOrders();
}
};



var controllerQueue={

renderQueue:function(){
	console.log("this is model order "+modelOrder.order);
	viewQueue.init();
	if(!(modelOrder.order===null||modelOrder.order===undefined))
	{
		modelOrder.order.forEach(function(orderItem,index){
		console.log(orderItem.orderId);
			viewQueue.addOrder(orderItem.orderName,orderItem.itemName,orderItem.status,orderItem.orderId)
		
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
		orderTableDivel = document.getElementById("orderTableDiv");
		orderTableel = document.getElementById("orderTable");
		this.addEventListener();
	},

	addEventListener: function(){
		var tableel = document.getElementById("orderTable");
		tableel.onclick = function(e){
			e = e || event;
			var target = e.target;
			console.log("delete:"+target.id.split("_")[1]);
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		}
	},

	orderRowInnerHTML: function(personName, itemName, status, orderID){
		return '<td class="s-q__name"><i class="fa fa-times-circle fa-lg" id="cancel_'+orderID+'" ></i><span>'+ personName+'<span></td><td class="s-q__item">' + itemName + '</td><td class="s-q__status--'+status+'">'+status+' </td>';
	},

	addOrder: function(personName, itemName, status, orderID, userID){
		rowel = document.createElement("tr");
		rowel.innerHTML = viewQueue.orderRowInnerHTML(personName, itemName, status,orderID);
		rowel.setAttribute('class', 's-q-e__item '+userID);
		rowel.setAttribute('id', orderID);
		orderTableel.appendChild(rowel);
	},

	ordertableReset: function(){
		orderTableDivel.innerHTML = " ";
		orderTableel = document.createElement("table");
		orderTableel.innerHTML = '<tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr>';
		orderTableel.setAttribute('class','s-q__table');
		orderTableel.setAttribute('id', 'orderTable');
		orderTableDivel.appendChild(orderTableel);	
	}
};


