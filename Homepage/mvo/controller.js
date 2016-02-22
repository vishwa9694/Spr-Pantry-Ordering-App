var orderQueueController = {
	getOrders: function(){
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
		notificationsView.init();
	},
	getNotifications: function(){
		return notifications;
	}
}

var controller = {
	init: function(){
		orderQueueController.init();
		itemListController.init();
		headerController.init();
		notificationsController.init();
	}
}

controller.init();
