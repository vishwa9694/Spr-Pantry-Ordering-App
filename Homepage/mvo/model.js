
var model={

init:function(){
	this.orders=serverServices.getOrders();
	this.items=serverServices.getItems();
	this.notifications=serverServices.getNotifications();
}

}