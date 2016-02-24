
var orderTableDivel, orderTableel, menuOrderTableel, menuTableDivel, tableNoel, itemList, notificationPanel;

var viewQueue = {
	init: function(){
		orderTableDivel = document.getElementById("orderTableDiv");
		orderTableel = document.getElementById("orderTable");
		this.addEventListener();
	},

	addEventListener: function(){
		var tableel = document.getElementById("orderTable");
		tableel.onclick = function(e){
			e = e || event;
			var target = e.target;
			console.log("delete:"+target.id.split("_")[1]);
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		}
	},

	orderRowInnerHTML: function(personName, itemName, status, orderID){
		return '<td class="s-q__name"><i class="fa fa-times-circle fa-lg" id="cancel_'+orderID+'" ></i><span>'+ personName+'<span></td><td class="s-q__item">' + itemName + '</td><td class="s-q__status--'+status+'">'+status+' </td>';
	},

	addOrder: function(personName, itemName, status, orderID, userID){
		rowel = document.createElement("tr");
		rowel.innerHTML = viewQueue.orderRowInnerHTML(personName, itemName, status,orderID);
		rowel.setAttribute('class', 's-q-e__item '+userID);
		rowel.setAttribute('id', orderID);
		orderTableel.appendChild(rowel);
	},

	ordertableReset: function(){
		orderTableDivel.innerHTML = " ";
		orderTableel = document.createElement("table");
		orderTableel.innerHTML = '<tr class="s-q-e__heading"><th>Name</th><th>Order</th><th>Status</th></tr>';
		orderTableel.setAttribute('class','s-q__table');
		orderTableel.setAttribute('id', 'orderTable');
		orderTableDivel.appendChild(orderTableel);	
	}
};




var itemListView = {
    init: function(){
        var menu;
        this.menuList = document.getElementById("menuList");
        console.log("   asfa:"+this.menuList);
        //this.render();
        menu = document.getElementsByClassName("menu")[0];
        menu.onclick = function(e) {
            e = e || event
            var target = e.target;
            var itemName=target.id.split("_")[1];
            if(e.target.id.indexOf("Click")>=0)
            {
                controllerMenuOrder.updateItem(itemName);
            }
        }
    },
 
    addCategory: function(categoryName){
        this.category=document.createElement("div");
        this.category.className="category";
        this.category.id=categoryName;
        this.header = document.createElement("div");
        this.header.className="category__header";
        this.header.id=categoryName+"__header"
        this.header.innerHTML = categoryName;
        console.log("category header id "+this.header.id);
        this.categoryContainer = document.createElement("div");
        this.categoryContainer.className="category__container";
        this.categoryContainer.id=categoryName+"__container";
        this.menuList.appendChild(this.category);
        this.category.appendChild(this.header);
        this.category.appendChild(this.categoryContainer);
    },
    addItem:function(iName,iAvailable,iImg,categoryHeader,catIndex,iIndex){
        itemDiv=document.createElement("div");
        itemDiv.className="category__item";
        itemDiv.innerHTML = '<img src=' + iImg + ' class="category__item__image">' +
            '<div class="category__item__hover">' +
            '<i class="fa fa-plus-circle fa-3x ci__hover__click" id="Click_'+iName+'"></i>' +
            '</div>' +
            '<div class="category__item__name" data-type=' +iAvailable+ ' id="tileName_'+iIndex+'">' + iName + '</div>';
        console.log("Cat header "+categoryHeader);
        var categoryDiv=document.getElementById(categoryHeader+"__container");
        console.log("categoryheader id is "+categoryDiv.id);
        categoryDiv.appendChild(itemDiv);
      
       
    }  
       
    };
var viewMenuOrder = {
    
    init: function(){
        menuOrderTableel = document.getElementById("menuOrder");
        tableNoel = document.getElementById("user-table");
        menuTableDivel = document.getElementById("menuOrderDiv");
     	this.addEventListener();   
    },
    addEventListener: function(){
        menuOrderTableel.onclick = function(e){
            e = e || event;
            var target = e.target;
            console.log(target.id.split("_")[1]);
            console.log("classname"+target.className);
            if (target.className == "fa fa-times-circle fa-lg itemcancel"){
                controllerMenuOrder.deleteItem(target.id.split("_")[1]);
            }
            else if (target.id.split("_")[0] == "add"){
                controllerMenuOrder.increaseQuant(target.id.split("_")[1]);
            	
            }
            else if (target.id.split("_")[0] == "sub"){
                controllerMenuOrder.decreaseQuant(target.id.split("_")[1]);
            }
            
        }
    },
    itemNameInnerHTML: function(name){
        return '<i class="fa fa-times-circle fa-lg itemcancel" id="cancel_'+name+'"></i><span>' + name + '</span>';
    },
    addButtonInnerHTML: function(name){
        return '<button classs="add-but adder" id="add_'+name+'">+</button>';
    },  
    removeButtonInnerHTML: function(name){
        return '<button classs="add-but sub" id="sub_'+name+'">-</button>';
    },
    specialInstructionsInnerHTML: function(name){
        return '<input class="in_comment" placeholder="Special Instructions" id="special_'+name+'"/>';
    },
    addItem: function(name){
        var menuOrderRowel = document.createElement("tr");
        menuOrderRowel.setAttribute('class', 's-o-e__item');
        
        // Name Adder
        var menuOrderItemNameel = document.createElement("td");
        menuOrderItemNameel.setAttribute('class', 'item__name');
        menuOrderItemNameel.innerHTML = viewMenuOrder.itemNameInnerHTML(name);
        menuOrderRowel.appendChild(menuOrderItemNameel);
        //Add button adder
        var menuOrderAddel = document.createElement("td");
        menuOrderAddel.innerHTML = viewMenuOrder.addButtonInnerHTML(name);
        menuOrderRowel.appendChild(menuOrderAddel);
        //Add the quantity
        var menuOrderQtyel = document.createElement("td");
        menuOrderQtyel.setAttribute('class', 'item-qty');
        menuOrderQtyel.setAttribute('id', 'qty_'+name);
        menuOrderQtyel.innerHTML = "1";
        menuOrderRowel.appendChild(menuOrderQtyel);
        //Remove an item (Subtract the quantity)
        var menuOrderRemel = document.createElement("td");
        menuOrderRemel.innerHTML = viewMenuOrder.removeButtonInnerHTML(name);
        menuOrderRowel.appendChild(menuOrderRemel);
        //Special Instructions
        var menuOrderSplInsel = document.createElement("td");
        menuOrderSplInsel.setAttribute('class', 'item-comment');
        menuOrderSplInsel.innerHTML = viewMenuOrder.specialInstructionsInnerHTML(name);
        menuOrderRowel.appendChild(menuOrderSplInsel);
        //Finally adding the row to the table
        menuOrderTableel.appendChild(menuOrderRowel);
    },
    showQuantity: function(itemName, quantity){
        var quantityel = document.getElementById("qty_"+itemName);
        quantityel.innerHTML = quantity;
    },
   menuOrderReset: function(){
        menuTableDivel.innerHTML = " ";
        menuOrderTableel = document.createElement("table");
        menuOrderTableel.setAttribute('class', 's-o-e__table');
        menuOrderTableel.setAttribute('id', 'menuOrder');
        menuTableDivel.appendChild(menuOrderTableel);
    	this.addEventListener();
    },
    getTable: function(){
    	console.log("Table"+tableNoel.value);
        return tableNoel.value;
    },
	getDescription: function(name){
		console.log("special_"+name);
		console.log("domelement: "+document.getElementById("special_"+name));
        return document.getElementById("special_"+name).value;
    }
};








var headerView = {
	init: function(){
		var notification=document.getElementsByClassName("header-notification")[0];
		var notiBody = document.getElementsByClassName("notificationBody")[0];
		notification.onclick=function()
		{
			console.log("Yello");
			document.getElementById("notification_count").style="visibility:hidden";

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
			notificationsController.setTrue();
			document.getElementById("notificationBody").innerHTML = " ";
			notificationsView.init();
		});
	},
};

var notificationsView = {
	init: function(){
		notificationPanel = document.getElementById("notificationBody");
		this.render();
	},

	render: function(){
		var notifications, nli, nreason;
		notifications =  notificationsController.getNotifications();
		notifications.forEach(function(nitem){
			if(!nitem.read) {
				nli = document.createElement("li");
				nli.setAttribute('id', 'notification--' + nitem.status);
				nli.innerHTML = "Your Item : " + nitem.item + " is " + nitem.status + ". "
				if (nitem.reason) {
					nreason = document.createElement("div");
					nreason.setAttribute('id', 'notification__cancel__reason');
					nreason.innerHTML = nitem.reason;
					nli.appendChild(nreason);
				}
				notificationPanel.appendChild(nli);
			}
		});

	}
};


