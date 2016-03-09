(function() {
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
			//cancelDialogView.init();
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
	},
	orderQueueView = {
		queueTemplate: '',
		tableEl: document.getElementById("queueTable"),
		init: function() {
			var that = this;
			that.orders = controller.getOrdersForQueue();
			that.render(that.orders);

		},
		render: function(orders) {
			queueRowsHTML = orders.map(orderQueueView.getQueueRowHTML).join( '' );
			orderQueueView.tableEl.innerHTML = queueRowsHTML;
			this.postRender();
		},
		postRender: function() {
			this.actions = {
				cancel: cancelDialogView.init.bind(cancelDialogView),
				done: controller.orderCompleted.bind(controller),
				progress: controller.orderInProgress.bind(controller)
			}
			this.startQueueListeners();	
		},
		startQueueListeners: function() {
			var that = this;
			document.getElementById("clubOrdersCheck").addEventListener('change',that.renderClubbedOrders);
			that.tableEl.addEventListener('click',that.performSelectedAction);
		},
		renderClubbedOrders: function(){
			var orders = this.checked ? controller.getClubbedOrders(): controller.getOrdersForQueue();
			orderQueueView.render(orders);
		},
		performSelectedAction: function(e){
			var id = Number(e.target.dataset.order);
			controller.setcurrentOrder(id);
			orderQueueView.actions[e.target.dataset.btntype]();
		}, 
		getQueueRowHTML: function(order,index) {
			var inProgressClass = order.status === "InProgress"? 'do__row_in-progress': '', 
			queueRow = '<div class="do__table-row '+ inProgressClass + '" id="'+order.orderId+'"><div class="do__table-cell do__table-cell_id">'+order.orderNo+'</div> <div class="do__table-cell do__table-cell_name">'+order.orderName+'</div> <div class="do__table-cell do__table-cell_order">'+order.itemName+'</div> <div class="do__table-cell do__table-cell_description">'+order.itemDescription+'</div> <div class="do__table-cell do__table-cell_table">'+order.table+'</div> <div class="do__table-cell do__table-cell_quantity">'+order.quantity+'</div> <div class="do__table-cell do__table-cell_actions"><i class="fa fa-clock-o fa-2x" data-btntype="progress" data-order="'+order.orderId+'"></i><i class="fa fa-check-circle-o fa-2x" data-btntype="done" data-order="'+order.orderId+'"></i><i class="fa fa-times fa-2x" data-btntype="cancel" data-order="'+order.orderId+'"></i></div> </div>';
			return queueRow;			
		},
		removeOrderFromOrderQueue: function(orderId) {
			var orderRow = document.getElementById(''+orderId);
			orderRow.parentNode.removeChild(orderRow);
			cancelDialogView.closeCancelDialog();			
		},
		changeRowBackgroundColor: function() {
			document.getElementById(""+controller.clickedItemOrder.orderId).classList.add("do__row_in-progress");
		},
	},
	cancelDialogView = {
		modalTemplate: '<div class="inner"> <div title="Close" class="close" id="closeReason">X</div> <div class="md__heading">Why are you cancelling order?</div> <div class="md__labels display-block"> <input type="radio" name="reasons" value="Item not available" checked> Item not available </div> <div class="md__labels display-block"> <input type="radio" name="reasons" value="Off Duty"> Off Duty </div> <div class="md__labels display-block"> <input type="radio" name="reasons" value="Other"> Other </div> <button type="button" id="cancelOrderBtn" class="md__btn md__btn_save display-block">Ok</button> </div>', 
		reasonModal: document.getElementById('modalDialog'),
		init: function() {
			this.render();
		},
		render: function() {
			cancelDialogView.reasonModal.innerHTML = cancelDialogView.modalTemplate;
			cancelDialogView.reasonModal.classList.add("modal-open");
			this.postRender();
		},
		postRender: function() {
			this.startCancelDialogListeners();
		},
		startCancelDialogListeners: function() {
			document.getElementById("closeReason").addEventListener('click', this.closeCancelDialog);
			document.getElementById("cancelOrderBtn").addEventListener('click',this.cancelOrder);
		},
		closeCancelDialog: function () {
			cancelDialogView.reasonModal.classList.remove("modal-open");
			cancelDialogView.reasonModal.innerHTML = '';
		},
		cancelOrder: function() {
			var reasons = document.getElementsByName('reasons');
			reasons = Array.prototype.slice.call(reasons);
			var selReason = reasons.filter(function(reason){
				return reason.checked;
			});
			controller.cancelOrder(selReason[0]);	
		},	
	},
	addNewItemDialogView = {
		categoryDiv: false,
		modal: document.getElementById("modalDialog"),
		modalTemplate: '', 
		init: function() {
			document.getElementById("openAddItemModal").addEventListener('click',this.render);//listening
		},
		render: function() {
			var menu= controller.getMenu(),
			modal = addNewItemDialogView.modal,
			optionsHTML = menu.reduce(function(html, category) {
				return html + "<option>"+category.category+"</option>"; 
			}, '') + '<option data-cattype="new">Add New Category</option>',
			template = '<div class="inner"> <div title="Close" class="close" id="closeNewItemDialog">X</div> <div class="md__heading">Add New Item</div> <div> <div class="md__labels">Item Name</div> <input class="md__input box-border" id="itemNameInput"placeholder="Enter Item Name"> <p id="inWarning" class="md__warnings">Item Name cannot be null</p> </div> <div id="selectDiv"> <div class="md__labels">Select Category</div> <select id="categorySelect" class="md__input box-border" >' 
			+ optionsHTML 
			+'</select> </div> <div> <div class="md__labels">Add Item Image (Optional)</div> <div id="itemImg" class="md__subcat"> <!-- <input class="md__input box-border" placeholder="Enter SubCategory Name"> --> <input id="itemImgInput" class="md__input box-border" type="file" accept="image/*"> <!-- <input class="md__input box-border" placeholder="Enter SubCategory Name">	 --> </div> </div> <div> <button id = "saveItemBtn" type="button" class="md__btn md__btn_save">Save</button> <button id="cancelItemBtn" class="md__btn md__btn_cancel">Cancel</button> </div> </div>';
			modal.innerHTML = template;
			modal.classList.add("modal-open");
			addNewItemDialogView.postRender();
		},
		postRender: function() {
			this.initVariables()
			this.startAddNewItemModalListeners();
		},
		initVariables: function() {
			this.categorySelectEl = document.getElementById("categorySelect");
			this.itemNameInputEl = document.getElementById("itemNameInput");
			this.inWarningEl = document.getElementById("inWarning");
		},
		startAddNewItemModalListeners: function() {
			document.getElementById("closeNewItemDialog").addEventListener('click',addNewItemDialogView.closeAddNewItemDialog);
			this.categorySelectEl.addEventListener('change', addNewItemDialogView.assignCategoryForItem);
			document.getElementById("saveItemBtn").addEventListener('click', addNewItemDialogView.addNewItemInSideMenu);
			document.getElementById("cancelItemBtn").addEventListener('click', addNewItemDialogView.closeAddNewItemDialog);
			this.itemNameInputEl.addEventListener('input', addNewItemDialogView.removeItemNameWarning);
		},
		removeItemNameWarning: function(){
			addNewItemDialogView.inWarningEl.classList.remove("display-block");
			addNewItemDialogView.itemNameInputEl.classList.remove("md__input_warning");
		},
		addNewItemInSideMenu: function() {
			var itemNameInputEl = addNewItemDialogView.itemNameInputEl,
			itemName = itemNameInputEl.value,
			categorySelectEl = addNewItemDialogView.categorySelectEl,
			categoryName = categorySelectEl.options[categorySelectEl.selectedIndex].text,
			itemImg = document.getElementById("itemImgInput").value || "assets/defaultItem.png";
			if(categoryName == "Add New Category") {
				categoryName = document.getElementById("newCategoryInput").value;
			}
			if(!itemName || !categoryName) {
				if(!itemName) {
					addNewItemDialogView.inWarningEl.classList.add("display-block");
					itemNameInputEl.classList.add("md__input_warning");
				}
				if(!categoryName) {
					var cnWarningEl = '<p id="cnWarning" class="md__warnings display-block">Category Name cannot be null</p>';
					addNewItemDialogView.newCategoryEl.insertAdjacentHTML('beforeend',cnWarningEl);	
					addNewItemDialogView.newCategoryInputEl.classList.add("md__input_warning");					
				}
			}
			else {
				controller.addNewItem(categoryName, itemName, itemImg);
				addNewItemDialogView.closeAddNewItemDialog();
			}
		},
		assignCategoryForItem: function() {
			if(this.options[this.selectedIndex].dataset.cattype === "new" && !(addNewItemDialogView.categoryDiv)) {
				var newCategoryDivEl, newCategoryHTML;
				newCategoryDivEl = '<div id="newCategory"><div class="md__labels">New Category Name</div><input id="newCategoryInput" class="md__input box-border" placeholder="Enter Category Name"></div>';
				this.parentNode.insertAdjacentHTML('beforeend', newCategoryDivEl);
				addNewItemDialogView.newCategoryEl = document.getElementById("newCategory");
				addNewItemDialogView.newCategoryInputEl = document.getElementById("newCategoryInput");
				addNewItemDialogView.newCategoryInputEl.addEventListener('input', function() {
					document.getElementById("cnWarning").classList.remove("display-block");
					this.classList.remove("md__input_warning");
				});
				addNewItemDialogView.categoryDiv = true;
			}
			else {
				if(addNewItemDialogView.categoryDiv) {
					addNewItemDialogView.newCategoryEl.parentNode.removeChild(addNewItemDialogView.newCategoryEl);
					addNewItemDialogView.categoryDiv = false;
				}
			}
		},
		
		closeAddNewItemDialog: function() {
			var modal = addNewItemDialogView.modal;
			modal.classList.remove("modal-open");
			modal.innerHTML = '';
		},
	},
	leftSidePanelView = {	
		bodyElement: document.getElementById("body"),
		menuElement: document.getElementById("c-menu--slide-left"),
		maskElement: document.getElementById("c-mask"),
		init: function() {
			this.startSidePanelListeners();		
			this.render();				
		},
		render: function() {
			var menuCategories;
			menuCategories = controller.getmenuCategories();
			menuCategories.forEach(function(menuCategory) {
				var items = controller.getCategoryItemsForCategory(menuCategory);
				leftSidePanelView.addCategoryInSidePanel(menuCategory, items);	
			});
		},
		startSidePanelListeners: function() {
			document.getElementById("c-button--slide-left").onclick = leftSidePanelView.openSidePanel;
			this.maskElement.onclick = leftSidePanelView.closeSidePanel;
			document.getElementById("cancelButton").onclick = leftSidePanelView.closeSidePanel;
			this.menuElement.onchange = leftSidePanelView.changeItemAvailabilityStatus;
		},

		changeItemAvailabilityStatus: function(e) {
			var that = this;
			var categoryName = e.target.dataset.category;
			if(!(that.checked)) {
				controller.onItemUnavailable(categoryName, e.target.value);
			}
			else {
				controller.onItemAvailable(categoryName, e.target.value);
			}
		},
		addCategoryInSidePanel: function(category, categoryItems) {
			var categoryItemsList, categoryListEl, listItemEl;
			categoryListEl = document.getElementById("categoryList");
			listItemEl = '<li class="c-menu__item">'+category+'</li>';
			categoryItemsList = '<ul id="'+category+'">"';
			categoryItemsList = categoryItems.reduce(function(html,item) {
				var categoryItem, checkboxItem;
				return html + '<li class="c-menu__product"><input class="c-menu__product__check" value="'+item.itemName+'" type="checkbox" checked data-category="'+category+'" id="'+category+'_'+item.itemName+'">'+item.itemName+'</li>'
			}, categoryItemsList) + '</ul>';
			categoryListEl.insertAdjacentHTML('beforeend',listItemEl + categoryItemsList);
		},
		addItemInCategory: function(itemName, available, selectedCategory) {
			var categoryItem = '<li class="c-menu__product"><input class="c-menu__product__check" value="'+itemName+'" type="checkbox" checked data-category="'+selectedCategory+'" id="'+selectedCategory+'_'+itemName+'">'+itemName+'</li>';
			document.getElementById(selectedCategory).insertAdjacentHTML('beforeend', categoryItem);
		},
		openSidePanel: function() {
			leftSidePanelView.bodyElement.classList.add('has-active-menu');
			leftSidePanelView.menuElement.classList.add('is-active');
			leftSidePanelView.maskElement.classList.add('is-active');
		},
		closeSidePanel: function() {
			leftSidePanelView.bodyElement.classList.remove('has-active-menu');
			leftSidePanelView.menuElement.classList.remove('is-active');
			leftSidePanelView.maskElement.classList.remove('is-active');
		},
	},
	deliveredOrdersView = {
		addDeliveredOrder: function(order) {
			var doTableRowEl = '<div class="do__table-row"><div class="do__table-cell do__table-cell_dot">'+order.orderNo+'</div> <div class="do__table-cell do__table-cell_dot">'+order.orderName+'</div><div class="do__table-cell do__table-cell_dot">'+order.table+'</div> <div class="do__table-cell do__table-cell_dot">'+order.itemName+'</div></div>';
			$("#deliveryTable").prepend(doTableRowEl);
		},
	};
	controller.init();
}());