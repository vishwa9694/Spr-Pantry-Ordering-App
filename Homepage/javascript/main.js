var orderTableDivel, orderTableel, menuOrderTableel, menuTableDivel, tableNoel, itemList, notificationPanel;

var controllerMain={
	init:function(){
		console.log("Hello");
		
		controllerQueue.init();

		itemListController.init();

		controllerMenuOrder.init();
		viewMenuOrder.init();

		controllerNotifications.init();




	}
};
//controllerMain.init();
