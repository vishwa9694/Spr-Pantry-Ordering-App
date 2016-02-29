var orderTableDivel, orderTableel, menuOrderTableel, menuTableDivel, tableNoel, itemList, notificationPanel;

var controllerMain={
	init:function(){
		console.log("Hello");
		
		controllerQueue.renderQueue();

		modelItems.init();
		itemListController.init();

		controllerMenuOrder.init();
		viewMenuOrder.init();

		modelNotifications.init();
		controllerNotifications.init();




	}
};
//controllerMain.init();
