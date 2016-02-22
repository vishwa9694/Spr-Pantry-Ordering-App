
var item = document.getElementsByClassName("menu__container")[0];
item.onclick = function(e) {
  e = e || event  
  var target = e.target;
  createRow(target);
 }

function createRow(target){
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
		delRow(getID);
  		incItem(getID);
  		decreItem(getID);

	}

	else{

		document.getElementById("item-qty_"+getID).innerHTML=parseInt(document.getElementById("item-qty_"+getID).innerHTML)+1;

	}
};

function delRow(getID){
	var del=document.getElementById("delete_"+getID);
	del.onclick=function()
	{
					var child = document.getElementById("s-o-e__item_"+getID);
					child.parentNode.removeChild(child);
	}
};

function incItem(getID){
	var plus=document.getElementById("add_"+getID);
	plus.onclick=function(){

		document.getElementById("item-qty_"+getID).innerHTML=parseInt(document.getElementById("item-qty_"+getID).innerHTML)+1;
	};
};

function decreItem(getID){
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
};
var notification=document.getElementsByClassName("header-notification")[0];
	var notiBody = document.getElementsByClassName("notificationBody")[0];
	notification.onclick=function()
	{
		console.log("Yello");
		$("#notification__count").fadeOut("");
		
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
    });

