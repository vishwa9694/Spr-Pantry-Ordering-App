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
		this.orderTableDivEl = document.getElementById("orderTableDiv");
		this.ordertableEl = document.getElementById("orderTable");
	},

	orderRowInnerHTML: function(order){
		var td, cross, content;
		td = '<td class="s-q__name">';
		cross = '<i class="fa fa-times-circle fa-lg" id="cancel_'+order.orderID+'" ></i>';
		content = '<span>'+ order.personName +'<span></td><td class="s-q__item">' + order.itemName + '</td><td class="s-q__status--'+order.status+'">'+order.status+' </td>';
		if(order.displaycancel)
			return td + cross + content;
		else
			return td + content;			
	},

	addOrder: function(order){
		var rowEl;
		rowEl = document.createElement("tr");
		rowEl.innerHTML = viewQueue.orderRowInnerHTML(order);
		rowEl.setAttribute('class', 's-q-e__item '+order.userID);
		rowEl.setAttribute('id', order.orderID);
		this.ordertableEl.appendChild(rowEl);
		
	},

	ordertableReset: function(){
		this.orderTableDivEl.innerHTML = " ";
		this.ordertableEl = document.createElement("table");
		this.ordertableEl.innerHTML = '<tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr>';
		this.ordertableEl.setAttribute('class','s-q__table');
		this.ordertableEl.setAttribute('id', 'orderTable');
		this.orderTableDivEl.appendChild(this.ordertableEl);
		this.ordertableEl.onclick = function(event){
			event = event || window.event;
            var target = event.target;
           if(target.id.split("_")[0]==="cancel")
			{
				console.log("delete:"+target.id.split("_")[1]);
				controllerQueue.deleteOrder(target.id.split("_")[1]);
			}
			else
			{
				controllerQueue.init();	
			}
		};	
	}
};


