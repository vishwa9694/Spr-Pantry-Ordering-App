$(function(){
	var addItem=document.getElementById("add_item");
	var myOrder=document.createElement("div");
	addItem.addEventListener('click', createRow);

	function createRow(){
		if(!document.getElementById("order0")){
		var order_table=document.getElementById("order_list")
		var order_row=document.createElement("tr");
		order_row.id="order0";
		order_table.appendChild(order_row);

		var	firstOrder =document.getElementById("order0");
		var col =document.createElement("td");
		var increase=document.createElement("button");
		increase.innerHTML="+";
		var decrease=document.createElement("button");
		decrease.innerHTML="-";
		var quantity=document.createElement("span");
		quantity.id="count";
		quantity.innerHTML=1;
		col.appendChild(increase);
		col.appendChild(quantity);
		col.appendChild(decrease);
		order_row.appendChild(col);
	}
	else{
		
		document.getElementById("count").innerHTML=parseInt(document.getElementById("count").innerHTML)+1;
		console.log(document.getElementById("count").innerHTML);
		
	}

	}
});