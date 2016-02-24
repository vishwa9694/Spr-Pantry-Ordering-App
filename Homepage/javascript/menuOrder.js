
var modelmenuOrder={
init:function(){
	this.orderitemlist=[];
}
};

var controllerMenuOrder={


    init:function()
    {
        modelmenuOrder.init();
    },
    render:function(){
        console.log("rendering");
        modelmenuOrder.orderitemlist.forEach(function(orderitem){
            viewMenuOrder.addItem(orderitem.itemName,orderitem.quantity);
        });
    },
    updateItem:function(name)
    {
        console.log(modelmenuOrder.orderitemlist);
        var that=this;
        var found=false;
        modelmenuOrder.orderitemlist.forEach(function(menuitem,id){
            console.log("__"+menuitem.itemName+"__"+name);
            if(menuitem.itemName===name)
                {
                 	found=true;
                 	console.log("Hurrah");
                    that.increaseQuant(name);
                    //return true;
            }
        });
        if(found===false){
        console.log("Burrah_"+name);
        this.addItem(name);
        }
    },
    addItem:function(itemname)
    {
        neworderitem=new Object();
        neworderitem.uid=login.user.id;
        neworderitem.orderName=login.user.name;
        neworderitem.itemName=itemname;
        neworderitem.table=0;
        neworderitem.quantity=1;
        //neworderitem.itemDescription=description;
        modelmenuOrder.orderitemlist.push(neworderitem);
        //modelmenuOrder.orderitemlist.push(neworderitem);
        viewMenuOrder.addItem(itemname,1);
        return modelmenuOrder.orderitemlist.length-1;
        
    },
    deleteItem:function(itemName)
    {
    	console.log("Deleting");
        modelmenuOrder.orderitemlist.forEach(function(orderitem,index)
        {
            if(orderitem.itemName===itemName)
            {
                modelmenuOrder.orderitemlist.splice(index,1);
            }
        });
        console.log(modelmenuOrder.orderitemlist);
        viewMenuOrder.menuOrderReset();
        this.render();
        //modelmenuOrder.orderitem.length-=1;

    },
    increaseQuant:function(itemName){
            console.log("Increasing");
        	var count=-1;
     
        modelmenuOrder.orderitemlist.forEach(function(orderitem,index){
            if(orderitem.itemName===itemName)
            {
                    count=(++modelmenuOrder.orderitemlist[index].quantity);
            }

        });
        
        console.log(modelmenuOrder.orderitemlist);
        viewMenuOrder.showQuantity(itemName,count);
        
    },
    decreaseQuant:function(itemName)
    {
    	console.log("Decreasing");
        var count=-1;
        var that=this;
        modelmenuOrder.orderitemlist.forEach(function(orderitem,index)
        {
            if(orderitem.itemName==itemName)
            {
                if(modelmenuOrder.orderitemlist[index].quantity===1)
                {
                    that.deleteItem(itemName);
                    return true;
                }
                else{
                   count= (--modelmenuOrder.orderitemlist[index].quantity);
       				viewMenuOrder.showQuantity(itemName,count);
        			return true;
                }
            }
        });

        console.log(modelmenuOrder.orderitemlist);
    },
    submit:function(){
        var ordertable=viewMenuOrder.getTable();
        modelmenuOrder.orderitemlist.forEach(function(orderitem)
        {
            orderitem.itemDescription=viewMenuOrder.getDescription(orderitem.itemName);
            orderitem.table=ordertable;
            console.log(orderitem.itemDescription);

        });
        serverServices.sendorder(modelmenuOrder.orderitemlist);
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
    addItem: function(name,qty){
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
        menuOrderQtyel.innerHTML = qty;
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

