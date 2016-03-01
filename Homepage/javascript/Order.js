var modelOrder={

	init:function(callBackFunction){
		serverServices.getOrders((this.setOrders.bind(this)),callBackFunction);
	},

	getOrders:function(){
		return this.orders;
	},

	setOrders:function(orders){
		this.orders=JSON.parse(orders);
	}

};

var controllerQueue={
	init:function(){
		viewQueue.init();
		viewQueue.ordertableReset();
		modelOrder.init((this.renderQueue.bind(this)));
	},

	renderQueue:function(){
		var displaycancel=false;	
		if(!(modelOrder.getOrders()===null||modelOrder.getOrders()===undefined)){
			modelOrder.getOrders().forEach(function(orderItem,index){
				if(orderItem.uid===login.user.id&&orderItem.status==="Queued"){
					displaycancel=true;
				}
				var order = new controllerQueue.addOrderConstructor(orderItem, displaycancel);
				viewQueue.addOrder(order);
				displaycancel=false;
			});
		}
		else{
		
		}
	},

	deleteOrder:function(cancelrequest){
		cancelrequest=parseInt(cancelrequest);
		var serviceret=serverServices.cancelOrder(cancelrequest,this.init.bind(this));
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
	},

	orderRowInnerHTML: function(personName, itemName, status, orderID,displaycancel){
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


