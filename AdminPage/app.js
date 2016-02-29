
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

			//todo: reduce
			while(filteredOrders.length > 0) {
				item = filteredOrders[0].itemName;
				console.log("inloop");
				filteredOrders.forEach(function(order, index) {
					if(order.itemName === item) {
						clubbedOrders.push(filteredOrders.splice(index,1)[0]);
					}
				});	
			}
			orderModel.clubbedOrders = clubbedOrders;
		
			return orderModel.clubbedOrders;	
		},
	};
	var menuModel = {
		menu:null,
		getmenu: function() {
			return this.menu;
		},
		findCategoryByName: function(categoryName) {
			return requiredCategory = this.menu.find(function(category) {
				return (category.category === categoryName)
			});
			//return requiredCategory;
		},

		getCategoryNames: function() {
			var categoryNames = this.menu.map(function(category) {
				return category.category;
			});
			return categoryNames;
		},
	};
	
	var controller = {
		clickedItemOrder: null,

		init: function() {
			//services.temp();
			services.createRequest("GET","/orders",this.onOrdersReceived);
			services.createRequest("GET","/menu", this.onMenuReceived);
			// orderQueueView.init();
			cancelDialogView.init();
			addNewItemDialogView.init();
			// leftSidePanelView.init();
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
			orders = this.getAllOrders();
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
				//return mappedOrder;
			});
			//return queueOrders;
		},
		setcurrentOrder: function(index) {
			this.clickedItemOrder = orderModel.orders[index];
		},
		getAllSortedOrders: function() {
			return orderModel.getAllSortedOrders();
		},

		getClubbedOrders: function() {	
			return orderModel.getClubbedOrders();	
		},

		getmenu: function() {
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
				//return itemObject;
			});
			//return items;
		},
		addNewItemSuccess: function(response, itemDetails) {
			var categoryName, itemName, itemImg, menu, selectedCategory, item, categoryItems, menuCategory;
			categoryName = itemDetails.categoryName;
			itemName = itemDetails.itemName;
			itemImg = itemDetails.itemImg;
			menu = menuModel.getmenu();
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

		// updateServer: function(object, url) {
		// 	var xhttp = new XMLHttpRequest();
		// 	xhttp.open("POST", "http://localhost:3000/"+url, true);
		// 	//xhttp.setRequestHeader('X-REquested-With', 'XMLHttpRequest');
		// 	xhttp.onreadystatechange = function() {
		// 	    if (xhttp.readyState == 4 && xhttp.status == 200) {
		// 	      console.log(xhttp.responseText);
		// 	    }
		// 	};
		// 	xhttp.send(JSON.stringify(object));

		// },
		cancelOrder: function(reason) {
			services.createRequest("POST", "/changeOrderStatus",this.cancelOrderSuccess, {reason: reason, status:"Cancelled", orderId: this.clickedItemOrder.orderId, ntStatus: 'Cancelled'});
		},
		cancelOrderSuccess: function() {
			controller.clickedItemOrder.status = "Cancelled";
			orderQueueView.removeOrderFromOrderQueue(controller.clickedItemOrder.orderId);
		},
		orderCompleted: function() {
			//this.clickedItemOrder.status = "Completed";
			services.createRequest("POST","/changeOrderStatus",this.onOrderCompleteSuccess,{reason: null, status:"Completed", orderId: this.clickedItemOrder.orderId, ntStatus: 'Done'});
			

			//console.log(model.orders);
		},
		onOrderCompleteSuccess: function() {
			controller.clickedItemOrder.status = "Completed";
			orderQueueView.removeOrderFromOrderQueue(controller.clickedItemOrder.orderId);
			deliveredOrdersView.addDeliveredOrder(controller.clickedItemOrder);
		},
		orderInProgress: function() {
			//this.clickedItemOrder.status = "InProgress";
			services.createRequest("POST", "/changeOrderStatus",this.orderInProgressSuccess,{reason: null,status:"InProgress", orderId: this.clickedItemOrder.orderId, ntStatus: 'InProgress'});
			//console.log(model.orders);
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
					//controller.cancelOrder();
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

		
		// changeItemStatus: function(itemDetails) {
		// 	var categoryName = itemDetails.category;
		// 	var itemName = itemDetails.item;
		// 	var selectedCategory = menuModel.findCategoryByName(categoryName);
		// 	var selectedItem = selectedCategory.categoryItems.find(function(item) {
		// 		if(item.itemName === itemName) {
		// 			return item;
		// 		}
		// 	});
		// 	selectedItem.available = false;
			
		// 	var orders = this.getAllOrders();
		// 	orders.forEach(function(order){
		// 		if(order.itemName === itemName) {
		// 			services.cancelOrder({reason: "Item not available", status:"Cancelled", orderId: order.orderId, ntStatus: 'Cancelled'},order);
		// 		}
		// 	});
		// 	//console.log(menu);

		// 	//orderQueueView.removeUnavailableOrders(selectedItem.itemName);
		// },

		onItemAvailable: function(categoryName, itemName) {
			services.createRequest("POST","/changeItemStatus", this.onItemAvailableSuccess, {category: categoryName, item:itemName, status: true});
		},
		onItemAvailableSuccess: function(response, itemDetails) {
			var categoryName, itemName, selectedCategory, selectedItem;
			categoryName = itemDetails.category;
			itemName = itemDetails.item;
			//var menu = this.getmenu();
			selectedCategory = menuModel.findCategoryByName(categoryName);
			selectedItem = selectedCategory.categoryItems.find(function(item) {
				return (item.itemName === itemName)
			});
			selectedItem.available = true;
		},
	};

	// var rowCreator = function(rowObj){
	// 	return '<tr class="do__row"><td class="do__table-data box-border do__table-cell_id">1</td><td class="do__table-data box-border do__table-cell_name">'++'</td><td class="do__table-data box-border do__table-cell_order">Cornflakes</td><td class="do__table-data box-border do__table-cell_description">cold</td><td class="do__table-data box-border do__table-cell_table">9</td><td class="do__table-data box-border do__table-cell_quantity">1</td><td class="do__table-data box-border do__table-cell_actions"><i class="fa fa-clock-o fa-2x"></i><i class="fa fa-check-circle-o fa-2x"></i><i class="fa fa-times fa-2x"></i></td></tr>';	
	// }

	var orderQueueView = {
		init: function() {
			// console.log(this);
			var orders, clubbedOrders;
			orders = controller.getOrdersForQueue();
			orders.forEach(this.addOrderInQueue);
			$("#clubOrdersCheck").change(function(){
				$("#queueTable *").remove();
				if($(this).is(":checked")) {
					//$("#queueTable *").remove(); //todo:
					clubbedOrders = controller.getClubbedOrders();
					clubbedOrders.forEach(orderQueueView.addOrderInQueue);
					//orderQueueView.showInProgressOrders(clubbedOrders);
				}
				else {
					//$("#queueTable *").remove();
					//clubbedOrders = controller.getClubbedOrders();
					orders = controller.getOrdersForQueue();
					console.log(orders);
					orders.forEach(orderQueueView.addOrderInQueue);
					//orderQueueView.showInProgressOrders(orders);
				}
			});
			//TODO 
			$("#queueTable").click(function(e){
				if(e.target.id.indexOf("cancel")===0) {
					var index = Number(e.target.id.split("_")[1]);
					controller.setcurrentOrder(index);
					cancelDialogView.viewCancelDialog();
				}
				else if(e.target.id.indexOf("done")===0) {
					var index = Number(e.target.id.split("_")[1]);
					controller.setcurrentOrder(index);
					controller.orderCompleted();
				}
				else if(e.target.id.indexOf("progress")===0) {
					var index = Number(e.target.id.split("_")[1]);
					controller.setcurrentOrder(index);
					controller.orderInProgress();
				}
				// $(cancelIcon).click(function(currenttableRow, order) {
				// 	return function() {
				// 		controller.clickedItemOrder = order;
				// 		controller.orderInProgress();
						
				// 	}
				// }(tableRow,order));
				// $(doneIcon).click(function(currenttableRow, order) {
				// 	return function() {
				// 		controller.clickedItemOrder = order;
						
				// 		//$("#"+controller.clickedItemOrder.orderId).remove();
				// 	}
				// }(tableRow, order));
				// $(inProgressIcon).click(function(tableRow, order){
				// 	return function() {
				// 		controller.clickedItemOrder = order;
				// 		controller.orderInProgress();
						
						
				// 	}
				// }(tableRow, order));	
			});
		},

		addOrderInQueue: function(order,index) {
			var tableRow, tdString, actionsCell, inProgressIcon, doneIcon, cancelIcon; 
			// var that = this;
			// console.log(this);
			if(!(order.status === "Completed" || order.status === "Cancelled")) {

				tableRow = $("<tr>", {class: "do__row", id: order.orderId});
				tdString = '<td class="do__table-data box-border do__table-cell_id">'+order.orderNo+'</td>'+'<td class="do__table-data box-border do__table-cell_name">'+order.orderName+'</td>'+'<td class="do__table-data box-border do__table-cell_order">'+order.itemName+'</td>'+'<td class="do__table-data box-border do__table-cell_description">'+order.itemDescription+'</td>'+'<td class="do__table-data box-border do__table-cell_table">'+order.table+'</td>'+'<td class="do__table-data box-border do__table-cell_quantity">'+order.quantity+'</td>';
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_id", text: order.orderNo}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_name", text: order.orderName}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_order", text: order.itemName}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_description", text: order.itemDescription}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_table", text: order.table}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_quantity", text: order.quantity}));
				$(tableRow).html(tdString);
				actionsCell = $("<td>", {class: "do__table-data box-border do__table-cell_actions"});
				inProgressIcon = $("<i>", {class: "fa fa-clock-o fa-2x",id: "progress_"+index});
				doneIcon = $("<i>", {class: "fa fa-check-circle-o fa-2x", id: "done_"+index});
				cancelIcon = $("<i>", {class: "fa fa-times fa-2x", id: "cancel_"+index});
				tableRow.append(actionsCell.append(inProgressIcon, doneIcon, cancelIcon));
				$("#queueTable").append(tableRow);
				if(order.status === "InProgress") {
					$(tableRow).css('background-color', "#dff0d8");
				}
				
			}
			
		
		},

		removeOrderFromOrderQueue: function(orderId) {
			$("#"+orderId).remove();
			cancelDialogView.closeCancelDialog();			
		},

		// removeUnavailableOrders: function(itemName) {
		// 	$("#queueTable :contains('"+itemName+"')").remove();
		// },
		changeRowBackgroundColor: function() {
			$("#"+controller.clickedItemOrder.orderId).css('background-color', "#dff0d8");
		},
		// showInProgressOrders: function(orders) {
		// 	orders.forEach(function(order){
		// 		if(order.status === "InProgress") {
		// 			$("#"+order.orderId).css('background-color', "#dff0d8");
		// 		}
		// 	});
		// },
	};
//TODO inline styling
	var cancelDialogView = {

		init: function() {
			$("#closeReason").click(this.closeCancelDialog);
			$("#cancelOrderBtn").click(this.cancelOrder);
		},
		
		closeCancelDialog: function () {
			document.getElementById("reasonDialog").style.opacity = 0;
			document.getElementById("reasonDialog").style.pointerEvents = "none";
		},

		viewCancelDialog : function() {
			document.getElementById("reasonDialog").style.opacity = 1;
			document.getElementById("reasonDialog").style.pointerEvents = "auto";
		},

		cancelOrder: function() {
			var reason = $("input:radio[name='reasons']:checked").val();
			console.log(reason);
			controller.cancelOrder(reason);	
		},
		
	};

	var addNewItemDialogView = {
		categoryDiv: false,
		init: function() {
			$("#openAddItemModal").click(this.viewNewItemDialog);
			$("#closeNewItemDialog").click(this.closeAddNewItemDialog);
			
			$("#categorySelect").change(function() {
				if($( "#categorySelect option:selected" ).text() == "Add New Category" && !(addNewItemDialogView.categoryDiv)) {
					//console.log("safd",3)
					var newCategoryHTML = '<div id="newCategory"><div class="md__labels">New Category Name</div><input class="md__input box-border" placeholder="Enter Category Name"></div>';
					$("#categorySelect").after(newCategoryHTML);
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
			//console.log("safd",1)
			document.getElementById("AddItemModal").style.opacity = 1;
			document.getElementById("AddItemModal").style.pointerEvents = "auto";
			optionsHTML = "";
			menu = controller.getmenu();
			menu.forEach(function(category) {
				optionsHTML += "<option>"+category.category+"</option>"; 
			});
			
			optionsHTML += "<option>Add New Category</option>";
			$("#categorySelect").html(optionsHTML);
						
		},

		closeAddNewItemDialog: function() {
			document.getElementById("AddItemModal").style.opacity = 0;
			document.getElementById("AddItemModal").style.pointerEvents = "none";
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
				var categoryName = $(this).parent().parent().attr('id');
				if(!$(this).is(":checked")) {
					//console.log("inIF");
					
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
				var checkboxItem = $("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available});
				categoryItem.append(checkboxItem);
				//checkboxItem.
				categoryItem.append(document.createTextNode(item.itemName));
				categoryItemsList.append(categoryItem);
			});
			$("#categoryList").append(categoryItemsList);
		},

		addItemInCategory: function(itemName, available, selectedCategory) {
			var categoryItem = $("<li>",{class:"c-menu__product"});
			categoryItem.append($("<input>",{class: "c-menu__product__check", type:"checkbox", value: itemName, checked: available}));
			categoryItem.append(document.createTextNode(itemName));
			$("#"+selectedCategory).append(categoryItem);
		},

		openSidePanel: function() {
			bodyElement = document.getElementById("body");
			menuElement = document.getElementById("c-menu--slide-left");
			maskElement = document.getElementById("c-mask");
			bodyElement.classList.add('has-active-menu');
			menuElement.classList.add('is-active');
			maskElement.classList.add('is-active');
		},

		closeSidePanel: function() {
			bodyElement = document.getElementById("body");
			menuElement = document.getElementById("c-menu--slide-left");
			maskElement = document.getElementById("c-mask");
			bodyElement.classList.remove('has-active-menu');
			menuElement.classList.remove('is-active');
			maskElement.classList.remove('is-active');
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



