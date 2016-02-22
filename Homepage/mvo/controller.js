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

var controller = {
	init: function(){
		orderQueueController.init();
		itemListController.init();
		headerController.init();
	}
}

controller.init();
