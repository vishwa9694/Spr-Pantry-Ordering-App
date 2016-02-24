
var modelOrder={
init:function(){
	this.order=serverServices.getOrders();
}
};

var modelItems={
init:function(){
	this.item=serverServices.getItems();
}
};

var modelmenuOrder={
init:function(){
	this.orderitemlist=[];
}
};

var modelNotifications={
init:function(){	
	this.notification=serverServices.getNotifications();
}

};