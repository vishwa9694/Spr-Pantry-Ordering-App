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
