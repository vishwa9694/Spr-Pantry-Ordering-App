var orderTable, itemList;

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
		var item=document.getElementsByClassName("items");
		for(var list=0;list<item.length;list++){
			var addItem=document.getElementById("add_item"+list);
			addItem.addEventListener('click', orderView.addItem(list));
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
				citemDiv.innerHTML = '<img src=' + citem.img + '><div class="items_hover"><i class="fa fa-plus-circle fa-3x add_item" id="add_item'+itemIndex+'"></i></div><div class="item_name" id="tileName'+itemIndex+'">' + citem.iname + '</div>';
                citemDiv.setAttribute('class', 'items');
                subList.appendChild(citemDiv);
				itemIndex++;
			});
			itemList.appendChild(subList);
		});
	}
};

var orderView = {
	addItem: function(list){
		return function(){
			console.log("skjfbak");
			if(!document.getElementById("s-o-e__item"+list)){

				var order_table=document.getElementsByClassName("s-o-e__table")[0]; // get table id
				var order_row=document.createElement("tr");	// create row
				order_row.id="s-o-e__item"+list; // row id
				order_row.className="s-o-e__item" // row class

				order_table.appendChild(order_row); // add row to table



				/// row col1 itemName

				var itemName =document.createElement("td"); //col1
				itemName.className="item__name";
				itemName.id="item__name"+list;
				var tileName=document.getElementById("tileName"+list);// get name of the tile
				var cross=document.createElement("i");
				cross.className="fa fa-times-circle fa-lg";
				itemName.appendChild(cross);
				cross.id="delete"+list;
				var s = document.createElement("span");
				s.innerHTML = tileName.innerHTML;
				itemName.appendChild(s);


				// row col2 add button
				var itemAdd =document.createElement("td");//col2
				itemAdd.className="add";
				var increase=document.createElement("button");
				increase.innerHTML="+";
				increase.className="add-but";
				increase.id="add"+list;
				itemAdd.appendChild(increase) ;// add Add button to the col

				// row col3  quantity
				var qty =document.createElement("td");//col3
				qty.className="item-qty";
				qty.id="item-qty"+list;
				qty.innerHTML=1;

				// row col4 minus button
				var itemMinus =document.createElement("td"); //col4
				itemMinus.className="decre";
				var decrease=document.createElement("button");
				decrease.innerHTML="-";
				decrease.className="add-but";
				decrease.id="decre"+list;
				itemMinus.appendChild(decrease);


				// row col5 special instructions
				var comment =document.createElement("td");
				comment.className="item-comment";
				var comment_input =document.createElement("input");
				comment_input.className="in_comment";
				comment_input.placeholder="Special Instructions";
				comment_input.id="in-comment"+list;
				comment.appendChild(comment_input); // add input to col

				// add cols to row
				order_row.appendChild(itemName);
				order_row.appendChild(itemAdd);
				order_row.appendChild(qty);
				order_row.appendChild(itemMinus);
				order_row.appendChild(comment);


				// deleting the row
				var del=document.getElementById("delete"+list);
				del.onclick=function(){
					var child = document.getElementById("s-o-e__item"+list);
					child.parentNode.removeChild(child);
				}

				/// functionalities to + and - buttons
				var plus=document.getElementById("add"+list);
				plus.onclick=function(){

					document.getElementById("item-qty"+list).innerHTML=parseInt(document.getElementById("item-qty"+list).innerHTML)+1;
				};

				var minus=document.getElementById("decre"+list);
				minus.onclick=function(){
					if(parseInt(document.getElementById("item-qty"+list).innerHTML)>1)
					{
						document.getElementById("item-qty"+list).innerHTML=parseInt(document.getElementById("item-qty"+list).innerHTML)-1;
					}
					else if(parseInt(document.getElementById("item-qty"+list).innerHTML)==1){
						var child = document.getElementById("s-o-e__item"+list);
						child.parentNode.removeChild(child);
					}
				};

				//console.log(order_row);
			}
			else{

				document.getElementById("item-qty"+list).innerHTML=parseInt(document.getElementById("item-qty"+list).innerHTML)+1;

			}
		}
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