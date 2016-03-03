var modelOrder={

	init:function(callBackFunction){
		serverServices.getOrders(callBackFunction);
	},

	getOrders:function(){
		return this.orders;
	},

	setOrders:function(orders){
		this.orders=orders;
	}

};

var controllerQueue={
	init:function(){
		viewQueue.init();
		viewQueue.ordertableReset();
		modelOrder.init((this.serverCallBack.bind(this)));
	},
	serverCallBack:function(orders){
		modelOrder.setOrders(orders);
		this.renderQueue();
	},
	renderQueue:function(){
		var displayCancel=false;	
		if(modelOrder.getOrders()){
			modelOrder.getOrders().forEach(function(orderItem,index){
				if(orderItem.uid===login.user.id&&orderItem.status==="Queued"){
					displayCancel=true;
				}
				var order = new controllerQueue.order(orderItem, displayCancel);
				viewQueue.addOrder(order);
				displayCancel=false;
			});
		}
	},

	deleteOrder:function(cancelRequest){
		cancelRequest=parseInt(cancelRequest);
		var serviceret=serverServices.cancelOrder(cancelRequest,this.init.bind(this));
	},

	order: function(order, displayCancel){
		this.personName = order.orderName;
		this.itemName = order.itemName;
		this.status = order.status;
		this.orderID = order.orderId;
		this.userID = order.uid;
		this.displayCancel = displayCancel;
	}	
};


var viewQueue = {
	init: function(){
		this.orderTableContEl = document.getElementById("orderTableDiv");
		this.orderTableEl = document.getElementById("orderTable");
	},

	orderRowInnerHTML: function(order){
		var td, cancelBtn, content;
		td = '<td class="s-q__name">';
		cancelBtn = '<i class="fa fa-times-circle fa-lg" id="cancel_'+order.orderID+'" ></i>';
		content = '<span>'+ order.personName +'<span></td><td class="s-q__item">' + order.itemName + '</td><td class="s-q__status--'+order.status+'">'+order.status+' </td>';
		if(order.displayCancel)
			return td + cancelBtn + content;
		else
			return td + content;			
	},

	addOrder: function(order){
		var rowEl;
		rowEl = document.createElement("tr");
		rowEl.innerHTML = viewQueue.orderRowInnerHTML(order);
		rowEl.setAttribute('class', 's-q-e__item '+order.userID);
		rowEl.setAttribute('id', order.orderID);
		this.orderTableEl.appendChild(rowEl);
		
	},

	ordertableReset: function(){
		this.orderTableContEl.innerHTML = '<table class="s-q__table" id="orderTable"><tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr></table>'
		this.init();
		this.orderTableEl.onclick = function(event){
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


