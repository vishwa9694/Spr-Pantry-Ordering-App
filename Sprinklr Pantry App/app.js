// var inputCount = 1;
// var addBtn = document.getElementById("addInput");
// var removeBtn = document.getElementById("removeInput");
// var subCategories = document.getElementById("subCategories");
// addBtn.onclick = function () {
// 	var newInput = document.createElement("input");
// 	newInput.setAttribute("class","md__input box-border");
// 	newInput.setAttribute("placeholder","Enter SubCategory Name");
// 	subCategories.appendChild(newInput);
// 	inputCount++;
// }

// removeBtn.onclick = function () {
// 	if(inputCount > 1) {
// 		subCategories.removeChild(subCategories.lastChild);
// 		inputCount--;
// 	}
	
// }

$(function() {
	var model = {
		orders: [
		{
			orderNo:1,
			orderName: "Vishwa",
			table: 9,
			items: [
				{
					itemName: "Cornflakes",
					quantity: 1,
					itemDescription: "cold",
					status: "InQueue",
				},
				{
					itemName: "Maggi",
					quantity: 1,
					itemDescription: "No description",
					status: "InQueue",
				}
			],
		}],

		menu: [
			{
				category: "Bevarages",
				categoryItems: [
					{
						itemName: "Tea",
						available: true,
					},
					{
						itemName: "Coffee",
						available: true,
					},
					{
						itemName: "Bournvita",
						available:true,
					}
				],
			}
		],
	};
	
	var controller = {
		clickedItemOrder: null, 
		getAllOrders: function() {
			return model.orders;
		},

		getmenu: function() {
			return model.menu;
		}
	};

	// var rowCreator = function(rowObj){
	// 	return '<tr class="do__row"><td class="do__table-data box-border do__table-cell_id">1</td><td class="do__table-data box-border do__table-cell_name">'++'</td><td class="do__table-data box-border do__table-cell_order">Cornflakes</td><td class="do__table-data box-border do__table-cell_description">cold</td><td class="do__table-data box-border do__table-cell_table">9</td><td class="do__table-data box-border do__table-cell_quantity">1</td><td class="do__table-data box-border do__table-cell_actions"><i class="fa fa-clock-o fa-2x"></i><i class="fa fa-check-circle-o fa-2x"></i><i class="fa fa-times fa-2x"></i></td></tr>';	
	// }

	var orderQueueView = {
		init: function() {
			// console.log(this);
			var orders = controller.getAllOrders();
			orders.forEach(this.addOrderInQueue);
		},

		addOrderInQueue: function(order) {
			// var that = this;
			// console.log(this);
			order.items.forEach(function(item) {
				var tableRow = $("<tr>", {class: "do__row"});
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_id", text: order.orderNo}));
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_name", text: order.orderName}));
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_order", text: item.itemName}));
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_description", text: item.itemDescription}));
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_table", text: order.table}));
				tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_quantity", text: item.quantity}));
				var actionsCell = $("<td>", {class: "do__table-data box-border do__table-cell_actions"});
				var inProgressIcon = $("<i>", {class: "fa fa-clock-o fa-2x"});
				var doneIcon = $("<i>", {class: "fa fa-check-circle-o fa-2x"});
				var cancelIcon = $("<i>", {class: "fa fa-times fa-2x"});
				tableRow.append(actionsCell.append(inProgressIcon, doneIcon, cancelIcon));
				$("#queueTable").append(tableRow);
				$(cancelIcon).click(function(currenttableRow) {
					return function() {
						cancelDialogView.viewCancelDialog();
						controller.clickedItemOrder = currenttableRow;
					}
				}(tableRow));
				$(doneIcon).click(function(currenttableRow, order, item) {
					return function() {
						controller.clickedItemOrder = currenttableRow;
						$(controller.clickedItemOrder).remove();
						deliveredOrdersView.addDeliveredOrder(order, item);
					}
				}(tableRow, order, item));
				$(inProgressIcon).click(function(tableRow){
					return function() {
						tableRow.css('background-color', "#dff0d8");
					}
				}(tableRow));
			});
		},
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
			console.log($("input:radio[name='reasons']:checked").val());
			$(controller.clickedItemOrder).remove();
			cancelDialogView.closeCancelDialog();
		},
	};

	var addNewItemDialogView = {
		init: function() {
			$("#openAddItemModal").click(this.viewNewItemDialog);
			$("#closeNewItemDialog").click(this.closeAddNewItemDialog);

		},

		viewNewItemDialog: function() {
			document.getElementById("AddItemModal").style.opacity = 1;
			document.getElementById("AddItemModal").style.pointerEvents = "auto";
		},

		closeAddNewItemDialog: function() {
			document.getElementById("AddItemModal").style.opacity = 0;
			document.getElementById("AddItemModal").style.pointerEvents = "none";
		},
	};

	var leftSidePanelView = {
		
		init: function() {
			$("#c-button--slide-left").click(this.openSidePanel);
			$("#c-mask").click(this.closeSidePanel);
			$("#cancelButton").click(this.closeSidePanel);
			var menu = controller.getmenu();
			menu.forEach(function(menuCategory) {
				$("#categoryList").append($("<li>", {class:"c-menu__item", text: menuCategory.category}));
				var categoryItemsList = ($("<ul>"));
				menuCategory.categoryItems.forEach(function(item) {
					var categoryItem = $("<li>",{class:"c-menu__product"});
					categoryItem.append($("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available}));
					categoryItem.append(document.createTextNode(item.itemName));
					categoryItemsList.append(categoryItem);
				});
				$("#categoryList").append(categoryItemsList);
			});
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
		addDeliveredOrder: function(order, item) {
			var tableRow = $("<tr>", {class: "do__row"});
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.orderNo}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.orderName}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: order.table}));
			tableRow.append($("<td>", {class: "do__table-data box-border do__table-cell_dot", text: item.itemName}));
			$("#deliveryTable").prepend(tableRow);
		},
	};
	orderQueueView.init();
	cancelDialogView.init();
	addNewItemDialogView.init();
	leftSidePanelView.init();
});



