var orderTable, itemList, notificationPanel;

var orderQueueView = {
	init: function(){
		orderTable = document.getElementById("orderTable");

		this.render();
		var item = document.getElementsByClassName("s-q__table")[0];
		item.onclick = function(e) {
			e = e || event
			var target = e.target;
			orderView.addItem(target);
		}
	},

	render: function(){
		var row, nameCell;
		var orders = orderQueueController.getOrders(); 
		orders.forEach(function(order){
				nameCell = order.orderName;
				row = document.createElement("tr");
				row.innerHTML = '<td class="s-q__name"><i class="fa fa-times-circle fa-lg" id="cancel" ></i><span>'+ nameCell+'<span></td><td class="s-q__item">' + order.itemName + '</td><td class="s-q__status--'+order.status+'">'+order.status+' </td>';
				row.setAttribute('class','s-q-e__item '+order.uid);
				row.setAttribute('id',order.orderId);

			orderTable.appendChild(row);

		});
	},
};

var itemListView = {
	init: function(){
		itemList = document.getElementById("itemList");
		this.render();
		var item = document.getElementsByClassName("menu__container")[0];
		item.onclick = function(e) {
			e = e || event
			var target = e.target;
			if(e.target.id.indexOf("addItem")>=0)
				orderView.addItem(target);
		}
	},

	render: function(){
		var header, subList, citemDiv;
		var itemIndex = 0;
		var items = itemListController.getItems();
		items.forEach(function(item){
			header = document.createElement("div");
			header.setAttribute('class', 'category');
			header.innerHTML = item.category;
			itemList.appendChild(header);
			subList = document.createElement("div");
			subList.setAttribute('class', 'category__itemsList');
			item.categoryItems.forEach(function(citem){
				var outer = document.createElement("div");
				outer.setAttribute('class', 'outer');
				var available = document.createElement("div");
				available.innerHTML = "Not available";
				
				citemDiv = document.createElement("div");

				citemDiv.innerHTML = '<img src=' + citem.imgSrc + ' class="category__item__image"><div class="category__item__hover"><i class="fa fa-plus-circle fa-3x ci__hover__click" id="addItem_'+itemIndex+'"></i></div><div class="category__item__name" data-type=' +citem.available+ ' id="tileName_'+itemIndex+'">' + citem.itemName + '</div>';
                citemDiv.setAttribute('class', 'category__item');
                outer.appendChild(citemDiv);
                outer.appendChild(available);
                available.setAttribute('class','available_'+citem.available);
                subList.appendChild(outer);

                //outer.appendChild(citemDiv);
				itemIndex++;
			});
			itemList.appendChild(subList);
		});
	}
};

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