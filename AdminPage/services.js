var services = {
	createRequest: function(requestType, url, onSuccessCallback, object) {
		var xhr;
		xhr = new XMLHttpRequest();
		xhr.open(requestType, url, true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4 && xhr.status == 200) {
		    	onSuccessCallback(xhr.responseText, object);
		      	//model.orders = receivedOrders;
		      	//orderQueueView.init();
				//cancelDialogView.init();
				//addNewItemDialogView.init();
				
		    }
		};
		if(requestType === "POST") {
			xhr.send(JSON.stringify(object));
		}
		else {
			xhr.send();	
		}
		
	},
 
 }

 