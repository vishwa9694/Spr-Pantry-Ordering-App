
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
		var notifications = modelNotification.getNotifications();
		if(notifications.length <= 0) {
			viewNotifications.renderNoNotification();
		}
		else {
			viewNotifications.clearNotifications();
			notifications.forEach(function(notificationItem){
			
				viewNotifications.addNotification(notificationItem.item,notificationItem.status,notificationItem.reason);
				if(notificationItem.read===false)
					unreadcount++;
		
			});	
		}
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
		this.notificationPanelEl = document.getElementById("notificationBody");
		this.unreadnotificationEl = document.getElementById("notification_count");
	},
	renderNoNotification: function() {
		var item = document.createElement("li");
		item.style.color = "black";
		item.innerHTML = "No notifications";
		this.notificationPanelEl.appendChild(item);
	},

	clearNotifications: function() {
		this.notificationPanelEl.innerHTML="";
	},
	addNotification: function(itemName, status, reason){
		var notificationEl, notificationReasonDivEl;
		notificationEl = document.createElement("li");
		notificationEl.setAttribute('id', 'notification--' + status);
		notificationEl.innerHTML = "Your Item : " + itemName + " is " + status + ". "
		if (reason!==null){
			notificationReasonDivEl = document.createElement("div");
			notificationReasonDivEl.setAttribute('id', 'notification__cancel__reason');
			notificationReasonDivEl.innerHTML = reason;
			notificationEl.appendChild(notificationReasonDivEl);
		} 
		this.notificationPanelEl.insertBefore(notificationEl,this.notificationPanelEl.firstChild);
	},

	showUnreadCount : function(unreadMsgCount){
		this.unreadnotificationEl.innerHTML = unreadMsgCount; 
	},
	
	handler: function(){
		var notificationDiv,notification,notificationPanel;
		notificationDiv=document.querySelector(".notification_bar")
		notification=notificationDiv.querySelector(".header-notification");
		notificationPanel = notificationDiv.querySelector(".notificationBody");
		notification.onclick=function(event)
		{

			if (notificationPanel.classList.contains("hide")){
					notificationPanel.classList.remove("hide");
					event.stopPropagation();
			}

			else{
				notificationPanel.classList.add("hide");
			}
			
			controllerNotifications.settrueall();
		};
		document.addEventListener('click', function(){
			notificationPanel.classList.add("hide");
		});
	}
};