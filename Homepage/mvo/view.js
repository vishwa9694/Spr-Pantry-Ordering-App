var orderTable, itemList, notificationPanel;

var orderQueueView = {
	init: function(){
		orderTable = document.getElementById("orderTable");
		this.render();
	},

	render: function(){
		var row, nameCell;
		var orders = orderQueueController.getOrders(); 
		orders.forEach(function(order){
			order.items.forEach(function(item){
				nameCell = order.name;
				row = document.createElement("tr");
				row.innerHTML = '<td class="s-q__name">' + nameCell + '</td><td class="s-q__item">' + item.iname + '</td><td class="s-q__status--'+item.istatus+'">'+item.istatus+' </td>';
				row.setAttribute('class','s-q-e__item');
				orderTable.appendChild(row);
			});
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
			header.innerHTML = item.cname;
			itemList.appendChild(header);
			subList = document.createElement("div");
			subList.setAttribute('class', 'sub_list');
			item.citems.forEach(function(citem){
				citemDiv = document.createElement("div");
				citemDiv.innerHTML = '<img src=' + citem.img + '><div class="items_hover"><i class="fa fa-plus-circle fa-3x add_item" id="addItem_'+itemIndex+'"></i></div><div class="item_name" id="tileName_'+itemIndex+'">' + citem.iname + '</div>';
                citemDiv.setAttribute('class', 'items');
                subList.appendChild(citemDiv);
				itemIndex++;
			});
			itemList.appendChild(subList);
		});
	}
};

var orderView = {
	addItem: function(target){
		var getID=target.id.split("_");
		getID=getID[1];
		//console.log("chetta "+getID);
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
			var tileName=document.getElementById("tileName_"+getID);// get name of the tile
			var cross=document.createElement("i");
			cross.className="fa fa-times-circle fa-lg";
			itemName.appendChild(cross);
			cross.id="delete_"+getID;
			var s = document.createElement("span");
			s.innerHTML = tileName.innerHTML;
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
		var notification=document.getElementsByClassName("bell")[0];
		notification.onclick=function()
		{
			console.log("Yello");
			var notiBody = document.getElementsByClassName("notificationBody")[0];
			if (notiBody.style.display == 'block' || notiBody.style.display=='')
			{
				notiBody.style.display = 'none';
			}
			else
			{
				notiBody.style.display = 'block';
			}
		};
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
			nli = document.createElement("li");
			nli.setAttribute('id', 'notification--'+nitem.status);
			nli.innerHTML = "Your Item : "+nitem.item+" is "+nitem.status+". "
			if (nitem.reason){
				nreason = document.createElement("div");
				nreason.setAttribute('id', 'notification__cancel__reason');
				nreason.innerHTML = nitem.reason;
				nli.appendChild(nreason);
			}
			notificationPanel.appendChild(nli);
		});

	}
};