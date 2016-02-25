var orderTableDivel, orderTableel, menuOrderTableel, menuTableDivel, tableNoel, itemList, notificationPanel;

var controllerMain={
	init:function(){
		console.log("Hello");
		
		modelOrder.init();
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
