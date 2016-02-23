
$(function() {
	var model = {
		orders: null,		
		menu: null,
	};
	
	var controller = {
		clickedItemOrder: null,

		init: function() {
			this.requestOrders();
			this.requestMenu();
			// orderQueueView.init();
			cancelDialogView.init();
			addNewItemDialogView.init();
			// leftSidePanelView.init();
		} ,

		requestOrders: function(){
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "http://localhost:3000/orders", true);
			//xhttp.setRequestHeader('X-REquested-With', 'XMLHttpRequest');
			xhttp.onreadystatechange = function() {
			    if (xhttp.readyState == 4 && xhttp.status == 200) {
			    	model.orders = JSON.parse(xhttp.responseText);
			      	//model.orders = receivedOrders;
			      	orderQueueView.init();
					//cancelDialogView.init();
					//addNewItemDialogView.init();
					
			    }
			};
			xhttp.send();
		},

		requestMenu: function(){
			var xhttp = new XMLHttpRequest();
			xhttp.open("GET", "http://localhost:3000/menu", true);
			//xhttp.setRequestHeader('X-REquested-With', 'XMLHttpRequest');
			xhttp.onreadystatechange = function() {
			    if (xhttp.readyState == 4 && xhttp.status == 200) {
			    	model.menu = JSON.parse(xhttp.responseText);
			      	// orderQueueView.init();
					//cancelDialogView.init();
					//addNewItemDialogView.init();
					leftSidePanelView.init();
			    }
			};
			xhttp.send();
		},


		getAllOrders: function() {
			return model.orders;
		},

		getAllSortedOrders: function() {
			return model.orders.sort(controller.compareOrders);
		},

		getClubbedOrders: function() {
			if(!("clubbedOrders" in model)) {
				var orders = this.getAllSortedOrders();
				var tempOrders = orders.map(function(order) {
					return order;
				});
				var clubbedOrders = [];
				while(tempOrders.length > 0) {
					var item = tempOrders[0].itemName;
					console.log("inloop");
					tempOrders.forEach(function(order, index) {
						if(order.itemName === item) {
							clubbedOrders.push(tempOrders.splice(index,1)[0]);
						}
					});	
				}
				model.clubbedOrders = clubbedOrders;
			}
			return model.clubbedOrders;	
			

		},

		compareOrders: function(order1, order2) {
			return (order1.orderNo - order2.orderNo);
		},

		getmenu: function() {
			return model.menu;
		},

		addNewItem: function(categoryName, itemName, itemImg) {
			var menu = this.getmenu();
			var selectedCategory = menu.find(function(category) {
				if(category.category === categoryName) {
					return category;
				}
			});
			if(selectedCategory) {
				var item = {itemName: itemName, available: true, imgSrc: itemImg};
				selectedCategory.categoryItems.push({itemName: itemName, available: true, imgSrc: itemImg});
				leftSidePanelView.addItemInCategory(item, selectedCategory.category);
			}
			else {
				var menuCategory = {category: categoryName, categoryItems:[{itemName: itemName, available: true, imgSrc: itemImg}]};
				menu.push(menuCategory);
				leftSidePanelView.addCategoryInSidePanel(menuCategory);
			}
			var itemDetails = {
				categoryName: categoryName,
				itemName: itemName,
				itemImg: itemImg
			};
			this.updateServer(itemDetails, 'addItemInMenu');
			//console.log(menu);
		},

		updateServer: function(object, url) {
			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", "http://localhost:3000/"+url, true);
			//xhttp.setRequestHeader('X-REquested-With', 'XMLHttpRequest');
			xhttp.onreadystatechange = function() {
			    if (xhttp.readyState == 4 && xhttp.status == 200) {
			      console.log(xhttp.responseText);
			    }
			};
			xhttp.send(JSON.stringify(object));

		},
		cancelOrder: function(reason) {
			
			this.clickedItemOrder.status = "Cancelled";
			this.updateServer({reason: reason, status:"Cancelled", orderId: this.clickedItemOrder.orderId, ntStatus: 'Cancelled'},'changeOrderStatus');
			//console.log(model.orders);
			//cancelDialogView.viewCancelDialog(orderId);
		},

		orderCompleted: function() {
			this.clickedItemOrder.status = "Completed";
			this.updateServer({reason: null, status:"Completed", orderId: this.clickedItemOrder.orderId, ntStatus: 'Done'},'changeOrderStatus');
			deliveredOrdersView.addDeliveredOrder(this.clickedItemOrder);

			//console.log(model.orders);
		},

		orderInProgress: function() {
			this.clickedItemOrder.status = "InProgress";
			this.updateServer({reason: null,status:"InProgress", orderId: this.clickedItemOrder.orderId, ntStatus: 'InProgress'},'changeOrderStatus');
			//console.log(model.orders);
		},

		onItemUnavailable: function(categoryName, itemName) {
			var menu = this.getmenu();
			var selectedCategory = menu.find(function(category) {
				if(category.category === categoryName) {
					return category;
				}
			});

			var selectedItem = selectedCategory.categoryItems.find(function(item) {
				if(item.itemName === itemName) {
					return item;
				}
			});
			selectedItem.available = false;
			this.updateServer({category: categoryName, item:itemName, status: false},'changeItemStatus');
			var orders = this.getAllOrders();
			orders.forEach(function(order){
				if(order.itemName === itemName) {
					order.status = "Cancelled";
					controller.updateServer({reason:"Item not available", status:"Cancelled", orderId: order.orderId, ntStatus: 'Cancelled'},'changeOrderStatus')
				}
			});
			//console.log(menu);

			orderQueueView.removeUnavailableOrders(selectedItem.itemName);

		},

		onItemAvailable: function(categoryName, itemName) {
			var menu = this.getmenu();
			var selectedCategory = menu.find(function(category) {
				if(category.category === categoryName) {
					return category;
				}
			});

			var selectedItem = selectedCategory.categoryItems.find(function(item) {
				if(item.itemName === itemName) {
					return item;
				}
			});
			selectedItem.available = true;
			this.updateServer({category: categoryName, item:itemName, status: true},'changeItemStatus');
			
		},
	};

	// var rowCreator = function(rowObj){
	// 	return '<tr class="do__row"><td class="do__table-data box-border do__table-cell_id">1</td><td class="do__table-data box-border do__table-cell_name">'++'</td><td class="do__table-data box-border do__table-cell_order">Cornflakes</td><td class="do__table-data box-border do__table-cell_description">cold</td><td class="do__table-data box-border do__table-cell_table">9</td><td class="do__table-data box-border do__table-cell_quantity">1</td><td class="do__table-data box-border do__table-cell_actions"><i class="fa fa-clock-o fa-2x"></i><i class="fa fa-check-circle-o fa-2x"></i><i class="fa fa-times fa-2x"></i></td></tr>';	
	// }

	var orderQueueView = {
		init: function() {
			// console.log(this);
			var orders = controller.getAllOrders();
			orders.forEach(this.addOrderInQueue);
			$("#clubOrdersCheck").change(function(){
				if($(this).is(":checked")) {
					$("#queueTable *").remove();
					var clubbedOrders = controller.getClubbedOrders();
					clubbedOrders.forEach(orderQueueView.addOrderInQueue);
					//orderQueueView.showInProgressOrders(clubbedOrders);
				}
				else {
					$("#queueTable *").remove();
					//var clubbedOrders = controller.getClubbedOrders();
					orders.forEach(orderQueueView.addOrderInQueue);
					//orderQueueView.showInProgressOrders(orders);
				}
			});
		},

		addOrderInQueue: function(order) {
			// var that = this;
			// console.log(this);
			if(!(order.status === "Completed" || order.status === "Cancelled")) {
				var tableRow = $("<tr>", {class: "do__row", id: order.orderId});
				var tdString = '<td class="do__table-data box-border do__table-cell_id">'+order.orderNo+'</td>'+'<td class="do__table-data box-border do__table-cell_name">'+order.orderName+'</td>'+'<td class="do__table-data box-border do__table-cell_order">'+order.itemName+'</td>'+'<td class="do__table-data box-border do__table-cell_description">'+order.itemDescription+'</td>'+'<td class="do__table-data box-border do__table-cell_table">'+order.table+'</td>'+'<td class="do__table-data box-border do__table-cell_quantity">'+order.quantity+'</td>';
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_id", text: order.orderNo}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_name", text: order.orderName}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_order", text: order.itemName}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_description", text: order.itemDescription}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_table", text: order.table}));
				// tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_quantity", text: order.quantity}));
				$(tableRow).html(tdString);
				var actionsCell = $("<td>", {class: "do__table-data box-border do__table-cell_actions"});
				var inProgressIcon = $("<i>", {class: "fa fa-clock-o fa-2x"});
				var doneIcon = $("<i>", {class: "fa fa-check-circle-o fa-2x"});
				var cancelIcon = $("<i>", {class: "fa fa-times fa-2x"});
				tableRow.append(actionsCell.append(inProgressIcon, doneIcon, cancelIcon));
				$("#queueTable").append(tableRow);
				if(order.status === "InProgress") {
					$(tableRow).css('background-color', "#dff0d8");
				}
				$(cancelIcon).click(function(currenttableRow, order) {
					return function() {
						controller.clickedItemOrder = order;
						cancelDialogView.viewCancelDialog();
						
					}
				}(tableRow,order));
				$(doneIcon).click(function(currenttableRow, order) {
					return function() {
						controller.clickedItemOrder = order;
						$("#"+controller.clickedItemOrder.orderId).remove();
						controller.orderCompleted();
						

					}
				}(tableRow, order));
				$(inProgressIcon).click(function(tableRow, order){
					return function() {
						controller.clickedItemOrder = order;
						tableRow.css('background-color', "#dff0d8");
						controller.orderInProgress();
					}
				}(tableRow, order));
			}
			
		
		},

		removeUnavailableOrders: function(itemName) {
			$("#queueTable :contains('"+itemName+"')").remove();
		},

		// showInProgressOrders: function(orders) {
		// 	orders.forEach(function(order){
		// 		if(order.status === "InProgress") {
		// 			$("#"+order.orderId).css('background-color', "#dff0d8");
		// 		}
		// 	});
		// },
	};

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
			cancelDialogView.closeCancelDialog();
			$("#"+controller.clickedItemOrder.orderId).remove();
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
				var itemName = $("#itemNameInput").val();
				var categoryName = $( "#categorySelect option:selected" ).text();
				if(categoryName == "Add New Category") {
					categoryName = $("#newCategory input").val();
				}
				var itemImg = $("#itemImg input").val() || "assets/defaultItem.png";
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
			//console.log("safd",1)
			document.getElementById("AddItemModal").style.opacity = 1;
			document.getElementById("AddItemModal").style.pointerEvents = "auto";
			var optionsHTML = "";
			var menu = controller.getmenu();
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
			$("#c-button--slide-left").click(this.openSidePanel);
			$("#c-mask").click(this.closeSidePanel);
			$("#cancelButton").click(this.closeSidePanel);
			var menu = controller.getmenu();
			menu.forEach(function(menuCategory) {
				leftSidePanelView.addCategoryInSidePanel(menuCategory);
				
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
		addCategoryInSidePanel: function(menuCategory) {
			$("#categoryList").append($("<li>", {class:"c-menu__item", text: menuCategory.category}));
			var categoryItemsList = ($("<ul>",{id: menuCategory.category}));
			menuCategory.categoryItems.forEach(function(item) {
				var categoryItem = $("<li>",{class:"c-menu__product"});
				var checkboxItem = $("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available});
				categoryItem.append(checkboxItem);
				//checkboxItem.
				categoryItem.append(document.createTextNode(item.itemName));
				categoryItemsList.append(categoryItem);
			});
			$("#categoryList").append(categoryItemsList);
		},

		addItemInCategory: function(item, selectedCategory) {
			var categoryItem = $("<li>",{class:"c-menu__product"});
			categoryItem.append($("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available}));
			categoryItem.append(document.createTextNode(item.itemName));
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



