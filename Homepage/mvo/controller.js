
var controllerQueue={

renderQueue:function(){
	console.log("this is model order "+modelOrder.order);
	viewQueue.init();
	if(!(modelOrder.order===null||modelOrder.order===undefined))
	{
		modelOrder.order.forEach(function(orderItem,index){
		
			viewQueue.addOrder(orderItem.orderName,orderItem.itemName,orderItem.status)
		
	});
	}
	else
	{
		console.log("No Object man");
	//	viewQueue.orderEmpty();
	}
	},


deleteOrder:function(cancelrequest){
		
		var serviceret=serverServices.cancelOrder(cancelrequest.id);
		if(serviceret===true)
		{
			modelOrder.forEach(function(orderitem){
				if(orderitem===cancelrequest.id)
					orderitem.status="Cancelled";
			});
			this.renderQueue();			
		}
		else
		{
			console.log("fjan");
		}

	}


};


var controllerMenuOrder={

	init:function()
	{
		modelmenuOrder.init();
	},

	updateItem:function(name)
	{
		modelmenuOrder.foreach(function(menuitem,id){
			if(menuitem.itemname===name)
				{
					this.increaseQuant(id);
					return true;
			}
		});
		this.additem(name);
		
	},

	addItem:function(itemname)
	{
		neworderitem=new Object();
		neworderitem.uid=login.user.id;
		neworderitem.orderName=login.user.name;
		neworderitem.itemName=itemname;
		neworderitem.table=0;
		neworderitem.quantity=1;
		neworderitem.itemDescription=description;
		modelmenuOrder.orderitemlist.push(neworderitem);
		modelmenuOrder.orderitemlist.push(neworderitem);

		viewOrder.additem(itemname);
		return modelmenuOrder.orderitemlist.length-1;
		
	},

	deleteItem:function(delid)
	{
		var localflag=0;
		modelmenuOrder.orderitemlist.forEach(orderitem,index)
		{
			if(index>delid)
			{
				modelmenuOrder.orderitem[index-1]=modelmenuOrder.orderitem[index];
			}
		}
		modelmenuOrder.orderitem.length-=1;

	},
	increaseQuant:function(incid){
		modelmenuOrder.orderitem[incid].quantity++;	
	},

	decreaseQuant:function(decid)
	{
			modelmenuOrder.orderitem[decid].quantity--;
			if(modelmenuOrder.orderitem[decid].quantity===0)
				this.deleteItem(decid);
	},
	submit:function(){
		var ordertable=viewmenuOrder.getTable();
		modelmenuOrder.orderitem.forEach(function(orderitem)
		{
			orderitem.itemDescription=viewmenuOrder.getDescription(orderitem.itemname);
		});

		serverServices.sendorder(modelmenuOrder);
	}


};
var itemListController = {
    
    init: function(){
        itemListView.init();
        var category=modelItems.item;
        var iIndex=0;
        category.forEach(function(menu,catIndex)
        {
            itemListView.addCategory(menu.category,catIndex);
            
            menu.categoryItems.forEach(function(categoryItem)
            {
            	console.log(categoryItem.itemName+","+categoryItem.available+","+categoryItem.imgSrc+","+menu.category+","+catIndex+","+iIndex);
                itemListView.addItem(categoryItem.itemName,categoryItem.available,categoryItem.imgSrc,menu.category,catIndex,iIndex);
                iIndex++
            });
        });
    }
};



var controllerMain={
	init:function(){
		modelOrder.init();
		controllerQueue.renderQueue();

		modelItems.init();
		itemListController.init();

		controllerMenuOrder.init();
		viewMenuOrder.init();




	}
};
controllerMain.init();



/*









var orderQueueController = {
	getOrders: function(){
		console.log("Called:",model.orders);
		return model.orders;
	},

	init: function(){
		orderQueueView.init();
	}
};

var itemListController = {
	getItems: function(){
		return model.items;
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
        //this.getNotificationsFromServer();
		notificationsView.init();
	},
	getNotifications: function(){
		return notifications;
	},
    setTrue: function(){
		notifications.forEach(function(noti){
			if(!noti.read){
				noti.read = true;
			}
		});
	}
}



var controller = {
	init: function() {
		model.init();
		orderQueueController.init();
		itemListController.init();
		headerController.init();
		notificationsController.init();
	},

};

//controller.init();
*/
