
var notificationPanel;

var modelNotifications={

	init:function(){	
		this.notification=serverServices.getNotifications(login.user.id);
	}

};
// var notification = {
//                 uid: filteredOrders[0].uid,
//                 read: false,
//                 item: filteredOrders[0].itemName,
//                 status: orderData.ntStatus,
//                 reason: orderData.reason
//             };

var controllerNotifications = {
	init: function(){
		console.log("Hello");
		viewNotifications.init();
		viewNotifications.handler();
		this.render();
	},
	render:function(){
		var unreadcount=0;
		modelNotifications.notification.forEach(function(notificationItem){
			
				viewNotifications.addNotification(notificationItem.item,notificationItem.status,notificationItem.reason);
				if(notificationItem.read===false)
					unreadcount++;
		
		});
		viewNotifications.showUnreadCount(unreadcount);
	},
	settrueall : function(){
		modelNotifications.notification.forEach(function(notificationItem){
			notificationItem.read=true;
		});	
		serverServices.readNotification(login.user.id);
		viewNotifications.showUnreadCount(0);

	}
	
};

var viewNotifications = {
	
	init: function(){
		notificationPanel = document.getElementById("notificationBody");
	},

	addNotification: function(itemName, status, reason){
		console.log("adding notification");
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
	},

	showUnreadCount : function(unreadMsgCount){
		unreadNotificationel = document.getElementById("notification_count");
		unreadNotificationel.innerHTML = unreadMsgCount; 
	},
	handler: function(){
		var notification=document.getElementsByClassName("header-notification")[0];
		var notiBody = document.getElementsByClassName("notificationBody")[0];
		notification.onclick=function()
		{
			console.log("Yello");
			$("#notification__count").fadeOut("");

			if (notiBody.style.display == 'block')
			{
				notiBody.style.display = 'none';

			}
			else
			{
				notiBody.style.display = 'block';
				event.stopPropagation();
			}
		};
		$(document).click( function(){
			notiBody.style.display = 'none';
			controllerNotifications.settrueall();
		});
	}
};