
var notificationPanelEl;

var modelNotification={

	init:function(callBackFunction){
		this.notifications=[];		
		serverServices.getNotifications(login.user.id,this.setNotifications.bind(this),callBackFunction);
	},
	getNotifications:function(){
		return this.notifications;
	},
	setNotifications:function(notification){
		this.notifications=JSON.parse(notification);
	}

};

var controllerNotifications = {
	
	init: function(){
		viewNotifications.init();
		modelNotification.init(this.render.bind(this));
		viewNotifications.handler();
	
	},
	render:function(){
		var unreadcount=0;
		modelNotification.getNotifications().forEach(function(notificationItem){	
			viewNotifications.addNotification(notificationItem.item,notificationItem.status,notificationItem.reason);
			if(notificationItem.read===false){
				unreadcount++;
			}
		
		});
		viewNotifications.showUnreadCount(unreadcount);
	},
	settrueall : function(){
		modelNotification.getNotifications().forEach(function(notificationItem){
			notificationItem.read=true;
		});	
		serverServices.readNotification(login.user.id);
		viewNotifications.showUnreadCount(0);
	}
	
};

var viewNotifications = {
	
	init: function(){
		notificationPanelEl = document.getElementById("notificationBody");
	},

	addNotification: function(itemName, status, reason){
		notificationEl = document.createElement("li");
		notificationEl.setAttribute('id', 'notification--' + status);
		notificationEl.innerHTML = "Your Item : " + itemName + " is " + status + ". "
		if (reason!==null){
			notificationReasonDivEl = document.createElement("div");
			notificationReasonDivEl.setAttribute('id', 'notification__cancel__reason');
			notificationReasonDivEl.innerHTML = reason;
			notificationEl.appendChild(notificationReasonDivEl);
		} 
		$(notificationPanelEl).prepend(notificationEl);
	},

	showUnreadCount : function(unreadMsgCount){
		unreadnotificationEl = document.getElementById("notification_count");
		unreadnotificationEl.innerHTML = unreadMsgCount; 
	},
	handler: function(){
		var notification=document.getElementsByClassName("header-notification")[0];
		var notiBody = document.getElementsByClassName("notificationBody")[0];
		notification.onclick=function(e)
		{
			$("#notification__count").fadeOut("");

			if (notiBody.style.display == 'block'){
				notiBody.style.display = 'none';
			}
			else{
				notiBody.style.display = 'block';
				e.stopPropagation();
			}
			controllerNotifications.settrueall();
		};
		$(document).click( function(){
			notiBody.style.display = 'none';
		});
	}
};