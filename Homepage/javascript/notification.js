
var modelNotifications={
init:function(){	
	this.notification=serverServices.getNotifications();
}

};

var notificationsController = {
	init: function(){
		console.log("Hello");
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
};

var notificationsView = {
	init: function(){
		notificationPanel = document.getElementById("notificationBody");
		this.render();
	},

	render: function(){
		var notifications, nli, nreason;
		notifications =  notificationsController.getNotifications();
		notifications.forEach(function(nitem){
			if(!nitem.read) {
				nli = document.createElement("li");
				nli.setAttribute('id', 'notification--' + nitem.status);
				nli.innerHTML = "Your Item : " + nitem.item + " is " + nitem.status + ". "
				if (nitem.reason) {
					nreason = document.createElement("div");
					nreason.setAttribute('id', 'notification__cancel__reason');
					nreason.innerHTML = nitem.reason;
					nli.appendChild(nreason);
				}
				notificationPanel.appendChild(nli);
			}
		});

	}
};