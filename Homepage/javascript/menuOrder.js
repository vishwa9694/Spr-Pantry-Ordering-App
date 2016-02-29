
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
        if(modelmenuOrder.orderitemlist.length===0&&!(login.user.id===null||login.user.id===undefined))
            viewMenuOrder.showsubmit();
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

        if(modelmenuOrder.orderitemlist.length===0)
            viewMenuOrder.hidesubmit();
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
        if((isNaN(ordertable)) || (ordertable == null)){
            document.getElementById("submitError").style.display = "block";
            document.getElementById("user-table").style.border = "1px solid rgb(169,68,66)";
        }
        else{
            modelmenuOrder.orderitemlist.forEach(function(orderitem)
            {
                orderitem.itemDescription=viewMenuOrder.getDescription(orderitem.itemName);
                orderitem.table=ordertable;
                console.log(orderitem.itemDescription);

            });
            serverServices.sendorder(modelmenuOrder.orderitemlist);
            controllerQueue.renderQueue();
        }
    }
};

var viewMenuOrder = {
    
    init: function(){
        menuOrderTableEl = document.getElementById("menuOrder");
        tableNoEl = document.getElementById("user-table");
        menuTableDivEl = document.getElementById("menuOrderDiv");
     	this.addEventListener();   
    },
    addEventListener: function(){
        menuOrderTableEl.onclick = function(e){
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
        var menuOrderRowEl = document.createElement("tr");
        menuOrderRowEl.setAttribute('class', 's-o-e__item');
        
        // Name Adder
        var menuOrderItemNameEl = document.createElement("td");
        menuOrderItemNameEl.setAttribute('class', 'item__name');
        menuOrderItemNameEl.innerHTML = viewMenuOrder.itemNameInnerHTML(name);
        menuOrderRowEl.appendChild(menuOrderItemNameEl);
        //Add button adder
        var menuOrderAddEl = document.createElement("td");
        menuOrderAddEl.innerHTML = viewMenuOrder.addButtonInnerHTML(name);
        menuOrderRowEl.appendChild(menuOrderAddEl);
        //Add the quantity
        var menuOrderQtyEl = document.createElement("td");
        menuOrderQtyEl.setAttribute('class', 'item-qty');
        menuOrderQtyEl.setAttribute('id', 'qty_'+name);
        menuOrderQtyEl.innerHTML = qty;
        menuOrderRowEl.appendChild(menuOrderQtyEl);
        //Remove an item (Subtract the quantity)
        var menuOrderRemEl = document.createElement("td");
        menuOrderRemEl.innerHTML = viewMenuOrder.removeButtonInnerHTML(name);
        menuOrderRowEl.appendChild(menuOrderRemEl);
        //Special Instructions
        var menuOrderSplInsEl = document.createElement("td");
        menuOrderSplInsEl.setAttribute('class', 'item-comment');
        menuOrderSplInsEl.innerHTML = viewMenuOrder.specialInstructionsInnerHTML(name);
        menuOrderRowEl.appendChild(menuOrderSplInsEl);
        //Finally adding the row to the table
        menuOrderTableEl.appendChild(menuOrderRowEl);
    },
    showQuantity: function(itemName, quantity){
        var quantityEl = document.getElementById("qty_"+itemName);
        quantityEl.innerHTML = quantity;
    },
   menuOrderReset: function(){
        menuTableDivEl.innerHTML = " ";
        menuOrderTableEl = document.createElement("table");
        menuOrderTableEl.setAttribute('class', 's-o-e__table');
        menuOrderTableEl.setAttribute('id', 'menuOrder');
        menuTableDivEl.appendChild(menuOrderTableEl);
    	this.addEventListener();
    },
    getTable: function(){
    	console.log("Table"+tableNoEl.value);
        return tableNoEl.value;
    },
	getDescription: function(name){
		console.log("special_"+name);
		console.log("domelement: "+document.getElementById("special_"+name));
        return document.getElementById("special_"+name).value;
    },
    showsubmit:function()
    {
        document.getElementsByClassName("user-form")[0].style.display="block";

    },

    hidesubmit:function()
    {
        document.getElementsByClassName("user-form")[0].style.display="none";

    }
};

