var orderTableDivel, orderTableel, itemList, notificationPanel;

var viewQueue = {
	init: function(){
		orderTableDivel = document.getElementById("orderTableDiv");
		orderTableel = document.getElementById("orderTable");
	},

	addEventListener: function(){
		var tableel = document.getElementById("orderTable");
		tableel.onclick = function(e){
			e = e || event;
			var target = e.target;
			controllerQueue.deleteOrder(target.id.split("_")[1]);
		}
	},

	orderRowInnerHTML: function(personName, itemName, status, orderID){
		return '<td class="s-q__name"><i class="fa fa-times-circle fa-lg" id="cancel_'+orderID+'" ></i><span>'+ personName+'<span></td><td class="s-q__item">' + itemName + '</td><td class="s-q__status--'+status+'">'+status+' </td>';
	},

	addOrder: function(personName, itemName, status, orderID, userID){
		rowel = document.createElement("tr");
		rowel.innerHTML = viewQueue.orderRowInnerHTML(personName, itemName, status);
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
            if(e.target.id.indexOf("addItem")>=0)
                orderView.addItem(target);
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
            '<i class="fa fa-plus-circle fa-3x ci__hover__click" id="addItem_'+iIndex+'"></i>' +
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
    },
    addEventListener: function(){
        menuOrderTableel.onclick = function(e){
            e = e || event;
            var target = e.target;
            controllerMenuOrder.deleteItem(target.id.split("_")[1]);
        }
    },
    itemNameInnerHTML: function(name){
        return '<i class="fa fa-times-circle fa-lg" id="cancel_'+name+'"></i><span>' + name + '</span>';
    },
    addButtonInnerHTML: function(name){
        return '<button classs="add-but" id="add_'+name+'"></button>';
    },  
    removeButtonInnerHTML: function(name){
        return '<button classs="add-but" id="sub_'+name+'"></button>';
    },
    specialInstructionsInnerHTML: function(name){
        return '<input class="in_comment" placeholder="Special Instructions" id="special_"'+name+'/>';
    },
    addItem: function(name){
        var menuOrderRowel = document.createElement("tr");
        menuOrderRowel.setAttribute('class', 's-o-e__item');
        
        // Name Adder
        var menuOrderItemNameel = document.createElement("td");
        menuOrderItemNameel.setAttribute('class', 'item__name');
        menuOrderItemNameel.innerHTML = viewMenuOrder.itemNameInnerHTML(name);
        menuOrderRowel.appendChild(menuOrderItemName);
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





/*

var orderView = {
	addItem: function(target){
		console.log("target is"+target);
		var getID=target.id.split("_");
		console.log(getID);
		getID=getID[1];
		console.log("idddd__"+getID);

		var iName=document.getElementById("tileName_"+getID);
		console.log(iName);
		var flag=iName.getAttribute("data-type");
		console.log("data-type"+flag);
		if(flag==="true")
		{
			if(!document.getElementById("s-o-e__item_"+getID))
			{	
				var order_table=document.getElementsByClassName("s-o-e__table")[0]; // get table class
				var order_row=document.createElement("tr");	// create row
				order_row.id="s-o-e__item_"+getID; // row id
				order_row.className="s-o-e__item" // row class
				order_table.appendChild(order_row); // add row to table

				/// row col1 itemName

				var itemName =document.createElement("td"); //col1
				itemName.className="item__name";
				itemName.id="item__name_"+getID;
				console.log(target.parentNode.parentNode);
				var tName=document.getElementById("tileName_"+getID);// get name of the tile
				//console.log("chudu "+tName);
				var cross=document.createElement("i");
				cross.className="fa fa-times-circle fa-lg";
				itemName.appendChild(cross);
				cross.id="delete_"+getID;
				var s = document.createElement("span");
				//console.log("tile name "+tName.innerHTML);
				s.innerHTML = tName.innerHTML;
				//console.log("peru "+s.innerHTML);
				itemName.appendChild(s);

				// row col2 add button
				var itemAdd =document.createElement("td");//col2
				itemAdd.className="add";
				var increase=document.createElement("button");
				increase.innerHTML="+";
				increase.className="add-but";
				increase.id="add_"+getID;
				itemAdd.appendChild(increase) ;// add Add button to the col

				// row col3  quantity
				var qty =document.createElement("td");//col3
				qty.className="item-qty";
				qty.id="item-qty_"+getID;
				qty.innerHTML=1;

				// row col4 minus button
				var itemMinus =document.createElement("td"); //col4
				itemMinus.className="decre";
				var decrease=document.createElement("button");
				decrease.innerHTML="-";
				decrease.className="add-but";
				decrease.id="decre_"+getID;
				itemMinus.appendChild(decrease);

				// row col5 special instructions
				var comment =document.createElement("td");
				comment.className="item-comment";
				var comment_input =document.createElement("input");
				comment_input.className="in_comment";
				comment_input.placeholder="Special Instructions";
				comment_input.id="in-comment_"+getID;
				comment.appendChild(comment_input); // add input to col

				// add cols to row
				order_row.appendChild(itemName);
				order_row.appendChild(itemAdd);
				order_row.appendChild(qty);
				order_row.appendChild(itemMinus);
				order_row.appendChild(comment);
				orderView.delRow(getID);
				orderView.incItem(getID);
				orderView.decreItem(getID);

			}

			else{
				document.getElementById("item-qty_"+getID).innerHTML=parseInt(document.getElementById("item-qty_"+getID).innerHTML)+1;
			}
		}

		else if(flag==="false"){
			//alert("item not available");
		}
	},

	delRow: function(getID){
		var del=document.getElementById("delete_"+getID);
		del.onclick=function()
		{
			var child = document.getElementById("s-o-e__item_"+getID);
			child.parentNode.removeChild(child);
		}
	},

	incItem: function(getID){
		var plus=document.getElementById("add_"+getID);
		plus.onclick=function(){

			document.getElementById("item-qty_"+getID).innerHTML=parseInt(document.getElementById("item-qty_"+getID).innerHTML)+1;
		};
	},

	decreItem: function(getID){
		var minus=document.getElementById("decre_"+getID);
		minus.onclick=function(){
			if(parseInt(document.getElementById("item-qty_"+getID).innerHTML)>1)
			{
				document.getElementById("item-qty_"+getID).innerHTML=parseInt(document.getElementById("item-qty_"+getID).innerHTML)-1;
			}
			else if(parseInt(document.getElementById("item-qty_"+getID).innerHTML)==1){
				var child = document.getElementById("s-o-e__item_"+getID);
				child.parentNode.removeChild(child);
			}
		};
	}


};

*/




