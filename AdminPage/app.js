$(function() {
	var orderModel = {
		orders: null,
		getAllOrders: function() {
			return this.orders;
		},
		getAllSortedOrders: function() {
			return this.orders.sort(this.compareOrders);
		},
		compareOrders: function(order1, order2) {
			return (order1.orderNo - order2.orderNo);
		},
		getClubbedOrders: function() {
			var orders,filteredOrders,clubbedOrders,item;
			orders = this.getAllSortedOrders();
			filteredOrders = orders.filter(function(order) {
				return (!(order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "cancelled"));
			});
			clubbedOrders = [];
			while(filteredOrders.length > 0) {
				item = filteredOrders[0].itemName;
				filteredOrders.forEach(function(order, index) {
					if(order.itemName === item) {
						clubbedOrders.push(filteredOrders.splice(index,1)[0]);
					}
				});	
			}
			orderModel.clubbedOrders = clubbedOrders;
			return orderModel.clubbedOrders;	
		},
	},
	menuModel = {
		menu:null,
		getMenu: function() {
			return this.menu;
		},
		findCategoryByName: function(categoryName) {
			return requiredCategory = this.menu.find(function(category) {
				return (category.category === categoryName)
			});
		},
		getCategoryNames: function() {
			var categoryNames = this.menu.map(function(category) {
				return category.category;
			});
			return categoryNames;
		},
	},
	controller =  {
		clickedItemOrder: null,
		init: function() {
			services.createRequest("GET","/orders",this.onOrdersReceived);
			services.createRequest("GET","/menu", this.onMenuReceived);
			cancelDialogView.init();
			addNewItemDialogView.init();
		},
		onOrdersReceived: function(orders) {
			orderModel.orders = JSON.parse(orders);
			orderQueueView.init();
		},
		onMenuReceived: function(menu) {
			menuModel.menu = JSON.parse(menu);
			leftSidePanelView.init();
		},
		getAllOrders: function() {
			return orderModel.getAllOrders();
		},
		getOrdersForQueue: function() {
			var orders;
			orders = this.getAllOrders().filter(function(order){
				return (!(order.status === "Completed" || order.status === "Cancelled"));
			});
			return orders.map(function(order){
				return mappedOrder = {
					uid: order.uid,
					orderId:order.orderId,
					orderNo:order.orderNo,
					orderName: order.orderName,
					table: order.table,
					itemName: order.itemName,
					quantity: order.quantity,
					itemDescription: order.itemDescription,
					status: order.status
				}
			});
		},
		setcurrentOrder: function(id) {
			var reqOrder = orderModel.orders.filter(function(order){
				return (order.orderId === id);
			});
			this.clickedItemOrder = reqOrder[0];
		},
		getAllSortedOrders: function() {
			return orderModel.getAllSortedOrders();
		},
		getClubbedOrders: function() {	
			return orderModel.getClubbedOrders();	
		},
		getMenu: function() {
			return menuModel.menu;
		},
		getmenuCategories: function() {
			return menuModel.getCategoryNames();
		},
		addNewItem: function(categoryName, itemName, itemImg) {
			var itemDetails = {
				categoryName: categoryName,
				itemName: itemName,
				itemImg: itemImg
			};
			services.createRequest("POST","/addItemInMenu",this.addNewItemSuccess,itemDetails);
		},
		getCategoryItemsForCategory: function(category) {
			var reqCategory =  menuModel.findCategoryByName(category);
			return reqCategory.categoryItems.map(function(item) {
				return itemObject = {
					itemName: item.itemName,
					available: item.available
				};
			});
		},
		addNewItemSuccess: function(response, itemDetails) {
			var categoryName, itemName, itemImg, menu, selectedCategory, item, categoryItems, menuCategory;
			categoryName = itemDetails.categoryName;
			itemName = itemDetails.itemName;
			itemImg = itemDetails.itemImg;
			menu = menuModel.getMenu();
			selectedCategory = menuModel.findCategoryByName(categoryName);
			if(selectedCategory) {
				item = {itemName: itemName, available: true, imgSrc: itemImg};					
				selectedCategory.categoryItems.push(item);
				leftSidePanelView.addItemInCategory(item.itemName, item.available, selectedCategory.category);
			}
			else {
				menuCategory = {category: categoryName, categoryItems:[{itemName: itemName, available: true, imgSrc: itemImg}]};
				menu.push(menuCategory);
				categoryItems = controller.getCategoryItemsForCategory(menuCategory.category);
				leftSidePanelView.addCategoryInSidePanel(menuCategory.category, categoryItems);
			}
		},
		cancelOrder: function(reason) {
			services.createRequest("POST", "/changeOrderStatus",this.cancelOrderSuccess, {reason: reason, status:"Cancelled", orderId: this.clickedItemOrder.orderId, ntStatus: 'Cancelled'});
		},
		cancelOrderSuccess: function() {
			controller.clickedItemOrder.status = "Cancelled";
			orderQueueView.removeOrderFromOrderQueue(controller.clickedItemOrder.orderId);
		},
		orderCompleted: function() {
			services.createRequest("POST","/changeOrderStatus",this.onOrderCompleteSuccess,{reason: null, status:"Completed", orderId: this.clickedItemOrder.orderId, ntStatus: 'Done'});
		},
		onOrderCompleteSuccess: function() {
			controller.clickedItemOrder.status = "Completed";
			orderQueueView.removeOrderFromOrderQueue(controller.clickedItemOrder.orderId);
			deliveredOrdersView.addDeliveredOrder(controller.clickedItemOrder);
		},
		orderInProgress: function() {
			services.createRequest("POST", "/changeOrderStatus",this.orderInProgressSuccess,{reason: null,status:"InProgress", orderId: this.clickedItemOrder.orderId, ntStatus: 'InProgress'});
		},
		orderInProgressSuccess: function() {
			controller.clickedItemOrder.status = "InProgress";
			orderQueueView.changeRowBackgroundColor();
		},
		onItemUnavailable: function(categoryName, itemName) {
			services.createRequest("POST","/changeItemStatus",this.onItemUnavailableSuccess,{category: categoryName, item:itemName, status: false});
		},
		onItemUnavailableSuccess: function(response,itemDetails) {
			var categoryName, itemName, selectedCategory, selectedItem, orders;
			categoryName = itemDetails.category;
			itemName = itemDetails.item;
			selectedCategory = menuModel.findCategoryByName(categoryName);
			selectedItem = selectedCategory.categoryItems.find(function(item) {
				return (item.itemName === itemName)
			});
			selectedItem.available = false;
			
			orders = controller.getAllOrders();
			orders.forEach(function(order){
				if(order.itemName === itemName) {
					controller.clickedItemOrder = order;
					services.createRequest("POST", "/changeOrderStatus",controller.cancelOrderUnavailableItemSuccess,{reason: "Item not available", status:"Cancelled", orderId: order.orderId, ntStatus: 'Cancelled'});
				}
			});
		},
		cancelOrderUnavailableItemSuccess: function(response, object) {
			var order = controller.getAllOrders().find(function(ord){
				return (ord.orderId === object.orderId)
			});
			order.status = "Cancelled";
			orderQueueView.removeOrderFromOrderQueue(object.orderId);
		},
		onItemAvailable: function(categoryName, itemName) {
			services.createRequest("POST","/changeItemStatus", this.onItemAvailableSuccess, {category: categoryName, item:itemName, status: true});
		},
		onItemAvailableSuccess: function(response, itemDetails) {
			var categoryName, itemName, selectedCategory, selectedItem;
			categoryName = itemDetails.category;
			itemName = itemDetails.item;
			//var menu = this.getMenu();
			selectedCategory = menuModel.findCategoryByName(categoryName);
			selectedItem = selectedCategory.categoryItems.find(function(item) {
				return (item.itemName === itemName)
			});
			selectedItem.available = true;
		},
	};
	var orderQueueView = {
		queueTemplate: '',
		init: function() {
			var orders, clubbedOrders, actions;
			orders = controller.getOrdersForQueue();
			orders.forEach(this.addOrderInQueue);
			$("#queueTable").html(this.queueTemplate);	
			$("#clubOrdersCheck").change(function(){
				$("#queueTable *").remove();
				orderQueueView.queueTemplate = '';
				if($(this).is(":checked")) {
					clubbedOrders = controller.getClubbedOrders();
					clubbedOrders.forEach(orderQueueView.addOrderInQueue);
				}
				else {
					orders = controller.getOrdersForQueue();
					orders.forEach(orderQueueView.addOrderInQueue);
				}
				$("#queueTable").html(orderQueueView.queueTemplate);
			});
			actions = {
				cancel: cancelDialogView.viewCancelDialog.bind(cancelDialogView),
				done: controller.orderCompleted.bind(controller),
				progress: controller.orderInProgress.bind(controller)
			}
			$("#queueTable").click(function(e){
				var id = Number(e.target.id.split("_")[1]);
				controller.setcurrentOrder(id);
				actions[e.target.id.split("_")[0]]();
				// if(e.target.id.indexOf("cancel")===0) {
				// //	var index = Number(e.target.id.split("_")[1]);
				// //	controller.setcurrentOrder(index);
				// 	cancelDialogView.viewCancelDialog();
				// }
				// else if(e.target.id.indexOf("done")===0) {
				// //	var index = Number(e.target.id.split("_")[1]);
				// //	controller.setcurrentOrder(index);
				// 	controller.orderCompleted();
				// }
				// else if(e.target.id.indexOf("progress")===0) {
				// //	var index = Number(e.target.id.split("_")[1]);
				// //	controller.setcurrentOrder(index);
				// 	controller.orderInProgress();
				// }
			});
		},
		
		addOrderInQueue: function(order,index) {
			var tableRow, tdString, actionsCell, inProgressIcon, doneIcon, cancelIcon; 
			//todo : filter these orders before hand
			//if(!(order.status === "Completed" || order.status === "Cancelled")) {
				//tableRow = $("<tr>", {class: "do__row", id: order.orderId});
			
				//$(tableRow).html(tdString);
				// actionsCell = $("<td>", {class: "do__table-data box-border do__table-cell_actions"});
				// inProgressIcon = $("<i>", {class: "fa fa-clock-o fa-2x",id: "progress_"+order.orderId});
				// doneIcon = $("<i>", {class: "fa fa-check-circle-o fa-2x", id: "done_"+order.orderId});
				// cancelIcon = $("<i>", {class: "fa fa-times fa-2x", id: "cancel_"+order.orderId});
				// tableRow.append(actionsCell.append(inProgressIcon, doneIcon, cancelIcon));
				//todo !!!!!!!!!!!! NEVER EVER DO THIS!!!!
				//$("#queueTable").append(tableRow);
				//todo: do this with class
				// if(order.status === "InProgress") {
				// 	$("").css('background-color', "#dff0d8");
				// }
			if(order.status === "InProgress") {
				tdString = '<tr class="do__row do__row_in-progress" id="'+order.orderId+'">'+'<td class="do__table-data box-border do__table-cell_id">'+order.orderNo+'</td>'+'<td class="do__table-data box-border do__table-cell_name">'+order.orderName+'</td>'+'<td class="do__table-data box-border do__table-cell_order">'+order.itemName+'</td>'+'<td class="do__table-data box-border do__table-cell_description">'+order.itemDescription+'</td>'+'<td class="do__table-data box-border do__table-cell_table">'+order.table+'</td>'+'<td class="do__table-data box-border do__table-cell_quantity">'+order.quantity+'</td>'+'<td class="do__table-data box-border do__table-cell_actions"><i class="fa fa-clock-o fa-2x" id="progress_'+order.orderId+'"></i><i class="fa fa-check-circle-o fa-2x" id="done_'+order.orderId+'"></i><i class="fa fa-times fa-2x" id="cancel_'+order.orderId+'"></i></td></tr>';
			}
			else {
				tdString = '<tr class="do__row" id="'+order.orderId+'">'+'<td class="do__table-data box-border do__table-cell_id">'+order.orderNo+'</td>'+'<td class="do__table-data box-border do__table-cell_name">'+order.orderName+'</td>'+'<td class="do__table-data box-border do__table-cell_order">'+order.itemName+'</td>'+'<td class="do__table-data box-border do__table-cell_description">'+order.itemDescription+'</td>'+'<td class="do__table-data box-border do__table-cell_table">'+order.table+'</td>'+'<td class="do__table-data box-border do__table-cell_quantity">'+order.quantity+'</td>'+'<td class="do__table-data box-border do__table-cell_actions"><i class="fa fa-clock-o fa-2x" id="progress_'+order.orderId+'"></i><i class="fa fa-check-circle-o fa-2x" id="done_'+order.orderId+'"></i><i class="fa fa-times fa-2x" id="cancel_'+order.orderId+'"></i></td></tr>';		
			}
			
			orderQueueView.queueTemplate += tdString;	
			//}			
		},
		removeOrderFromOrderQueue: function(orderId) {
			$("#"+orderId).remove();
			cancelDialogView.closeCancelDialog();			
		},
		changeRowBackgroundColor: function() {
			$("#"+controller.clickedItemOrder.orderId).css('background-color', "#dff0d8");
		},
	};
	var cancelDialogView = {
		init: function() {
			$("#closeReason").click(this.closeCancelDialog);
			$("#cancelOrderBtn").click(this.cancelOrder);
		},
		closeCancelDialog: function () {
			$("#reasonDialog").removeClass("modal-open");
			$("#reasonDialog").addClass("modal-close");
		},
		viewCancelDialog : function() {
			$("#reasonDialog").removeClass("modal-close");
			$("#reasonDialog").addClass("modal-open");
		},
		cancelOrder: function() {
			var reason = $("input:radio[name='reasons']:checked").val();
			controller.cancelOrder(reason);	
		},	
	};
	var addNewItemDialogView = {
		categoryDiv: false,
		init: function() {
			$("#openAddItemModal").click(this.viewNewItemDialog);
			$("#closeNewItemDialog").click(this.closeAddNewItemDialog);		
			$("#categorySelect").change(function() {
				if($(this).find(":selected" ).data("type") === "new" && !(addNewItemDialogView.categoryDiv)) {
					var newCategoryHTML = '<div id="newCategory"><div class="md__labels">New Category Name</div><input class="md__input box-border" placeholder="Enter Category Name"></div>';
					$(this).after(newCategoryHTML);
					$("#newCategory input").on('input',function() {
						$("#cnWarning").css("display", "none");
						$("#newCategory input").removeClass("md__input_warning");
					});
					addNewItemDialogView.categoryDiv = true;
				}
				else {
					if(addNewItemDialogView.categoryDiv) {
						$("#newCategory").remove();
						addNewItemDialogView.categoryDiv = false;
					}
				}
			});
			$("#saveItemBtn").click(function() {
				var itemName, categoryName, itemImg;
				itemName = $("#itemNameInput").val();
				categoryName = $( "#categorySelect option:selected" ).text();
				if(categoryName == "Add New Category") {
					categoryName = $("#newCategory input").val();
				}
				itemImg = $("#itemImg input").val() || "assets/defaultItem.png";
				if(!itemName || !categoryName) {
					if(!itemName) {
						$("#inWarning").css("display", "block");
						$("#itemNameInput").addClass("md__input_warning");
					}
					if(!categoryName) {
						$("#newCategory").append($("<p>",{class:"md__warnings", text:"Category Name cannot be null", id:"cnWarning"}));
						$("#cnWarning").css("display", "block");	
						$("#newCategory input").addClass("md__input_warning");					
					}
				}
				else {
					controller.addNewItem(categoryName, itemName, itemImg);
					addNewItemDialogView.closeAddNewItemDialog();
				}
			});
			$("#cancelItemBtn").click(function() {
				addNewItemDialogView.closeAddNewItemDialog();
			});
			$("#itemNameInput").on('input',function(){
				$("#inWarning").css("display", "none");
				$("#itemNameInput").removeClass("md__input_warning");
			});
		},
		viewNewItemDialog: function() {
			var optionsHTML, menu;
			$("#AddItemModal").removeClass("modal-close");
			$("#AddItemModal").addClass("modal-open");
			optionsHTML = "";
			menu = controller.getMenu();
			menu.forEach(function(category) {
				optionsHTML += "<option>"+category.category+"</option>"; 
			});			
			optionsHTML += "<option data-type='new'>Add New Category</option>";
			$("#categorySelect").html(optionsHTML);		
		},
		closeAddNewItemDialog: function() {
			$("#AddItemModal").removeClass("modal-open");
			$("#AddItemModal").addClass("modal-close");
			addNewItemDialogView.reset();
		},
		reset: function() {
			$("#itemNameInput").val("");
			$("#newCategory").remove();
			addNewItemDialogView.categoryDiv = false;
		},
	};
	var leftSidePanelView = {	
		init: function() {
			var menuCategories;
			$("#c-button--slide-left").click(this.openSidePanel);
			$("#c-mask").click(this.closeSidePanel);
			$("#cancelButton").click(this.closeSidePanel);
			menuCategories = controller.getmenuCategories();
			menuCategories.forEach(function(menuCategory) {
				var items = controller.getCategoryItemsForCategory(menuCategory);
				leftSidePanelView.addCategoryInSidePanel(menuCategory, items);	
			});
			$(document).on('change', '#c-menu--slide-left input:checkbox',(function() {
				var categoryName = $(this).attr('id').split("_")[0];
				if(!$(this).is(":checked")) {
					controller.onItemUnavailable(categoryName, $(this).val());
				}
				else {
					controller.onItemAvailable(categoryName, $(this).val());
				}
			}));
		},
		addCategoryInSidePanel: function(category, categoryItems) {
			var categoryItemsList; 
			$("#categoryList").append($("<li>", {class:"c-menu__item", text: category}));
			categoryItemsList = ($("<ul>",{id: category}));
			categoryItems.forEach(function(item) {
				var categoryItem = $("<li>",{class:"c-menu__product"});
				var checkboxItem = $("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available, id: category+"_"+item.itemName});
				categoryItem.append(checkboxItem);
				categoryItem.append(document.createTextNode(item.itemName));
				categoryItemsList.append(categoryItem);
			});
			$("#categoryList").append(categoryItemsList);
		},
		addItemInCategory: function(itemName, available, selectedCategory) {
			var categoryItem = $("<li>",{class:"c-menu__product"});
			categoryItem.append($("<input>",{class: "c-menu__product__check", type:"checkbox", value: itemName, checked: available, id: selectedCategory+"_"+itemName}));
			categoryItem.append(document.createTextNode(itemName));
			$("#"+selectedCategory).append(categoryItem);
		},
		openSidePanel: function() {
			bodyElement = $("#body");
			menuElement = $("#c-menu--slide-left");
			maskElement = $("#c-mask");
			bodyElement.addClass('has-active-menu');
			menuElement.addClass('is-active');
			maskElement.addClass('is-active');
		},
		closeSidePanel: function() {
			bodyElement = $("#body");
			menuElement = $("#c-menu--slide-left");
			maskElement = $("#c-mask");
			bodyElement.removeClass('has-active-menu');
			menuElement.removeClass('is-active');
			maskElement.removeClass('is-active');
		},
	};
	var deliveredOrdersView = {
		addDeliveredOrder: function(order) {
			var tableRow = $("<tr>", {class: "do__row"});
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.orderNo}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.orderName}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.table}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.itemName}));
			$("#deliveryTable").prepend(tableRow);
		},
	};
	controller.init();
});