
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
						imgSrc: "assets/defaultItem.png"
					},
					{
						itemName: "Coffee",
						available: true,
						imgSrc: "assets/defaultItem.png"

					},
					{
						itemName: "Bournvita",
						available:true,
						imgSrc: "assets/defaultItem.png"

					}
				],
			},
			{
				category: "Snacks",
				categoryItems: [
					{
						itemName: "Maggi",
						available: true,
						imgSrc: "assets/defaultItem.png"

					},
					{
						itemName: "Chocos",
						available: true,
						imgSrc: "assets/defaultItem.png"

					},
					{
						itemName: "Cornflakes",
						available:true,
						imgSrc: "assets/defaultItem.png"

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
			//console.log(menu);
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
			cancelDialogView.closeCancelDialog();
			$(controller.clickedItemOrder).remove();
			
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
		},
		addCategoryInSidePanel: function(menuCategory) {
			$("#categoryList").append($("<li>", {class:"c-menu__item", text: menuCategory.category}));
			var categoryItemsList = ($("<ul>",{id: menuCategory.category}));
			menuCategory.categoryItems.forEach(function(item) {
				var categoryItem = $("<li>",{class:"c-menu__product"});
				categoryItem.append($("<input>",{class: "c-menu__product__check", type:"checkbox", value: item.itemName, checked: item.available}));
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



