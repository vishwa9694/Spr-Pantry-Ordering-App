
var notificationPanel;

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
	},

	addNotification: function(itemName, status, reason){
		notificationel = document.createElement("li");
		notificationel.setAttribute('id', 'notification--' + status);
		notificationel.innerHTML = "Your Item : " + itemName + " is " + status + ". "
		if (!reason){
			notificationReasonDivel = document.createElement("div");
			notificationReasonDivel.setAttribute('id', 'notification__cancel__reason');
			notificationReasonDivel.innerHTML = reason;
			notificationel.appendChild(notificationReasonDivel);
		} 
		notificationPanel.appendChild(notificationel);
	}

	showUnread = function(unreadMsgCount){
		unreadNotificationel = document.getElementById("notification_count");
		unreadNotificationel.innerHTML = unreadMsgCount; 
	}
};