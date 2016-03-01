
var modelMenuOrder={
init:function(){
	this.orderItemList=[];
},
getOrderItemList:function(){
    return this.orderItemList;
},
setOrderItemList:function(orderlist){
    this.orderItemList=JSON.parse(orderlist);
}
};

var controllerMenuOrder={


    init:function(){
        viewMenuOrder.init();
        modelMenuOrder.init();
    },
    render:function(){
        console.log("rendering");
        modelMenuOrder.getOrderItemList().forEach(function(orderitem){
            viewMenuOrder.addItem(orderitem.itemName,orderitem.quantity);
        });
    },
    updateItem:function(name){
        console.log(modelMenuOrder.getOrderItemList());
        var that=this;
        var found=false;
        modelMenuOrder.getOrderItemList().forEach(function(menuitem,id){
            if(menuitem.itemName===name){
                 	found=true;
                    that.increaseQuant(name);
                    //return true;
            }
        });
        if(found===false){
            this.addItem(name);
        }
    },
    addItem:function(itemname){
        if(modelMenuOrder.getOrderItemList().length===0&&!(login.user.id===null||login.user.id===undefined))
            viewMenuOrder.showsubmit();
        neworderitem=new Object();
        neworderitem.uid=login.user.id;
        neworderitem.orderName=login.user.name;
        neworderitem.itemName=itemname;
        neworderitem.table=0;
        neworderitem.quantity=1;
        //neworderitem.itemDescription=description;
        modelMenuOrder.getOrderItemList().push(neworderitem);
        //modelMenuOrder.getOrderItemList().push(neworderitem);
        viewMenuOrder.addItem(itemname,1);
        return modelMenuOrder.getOrderItemList().length-1;
        
    },
    deleteItem:function(itemName){
    	console.log("Deleting");
        modelMenuOrder.getOrderItemList().forEach(function(orderitem,index)
        {
            if(orderitem.itemName===itemName)
            {
                modelMenuOrder.getOrderItemList().splice(index,1);
            }
        });
        console.log(modelMenuOrder.getOrderItemList());
        viewMenuOrder.menuOrderReset();
        this.render();

        if(modelMenuOrder.getOrderItemList().length===0)
            viewMenuOrder.hidesubmit();

    },

    increaseQuant:function(itemName){
            console.log("Increasing");
        	var count=-1;
     
        modelMenuOrder.getOrderItemList().forEach(function(orderitem,index){
            if(orderitem.itemName===itemName)
            {
                    count=(++modelMenuOrder.getOrderItemList()[index].quantity);
            }

        });
        
        console.log(modelMenuOrder.getOrderItemList());
        viewMenuOrder.showQuantity(itemName,count);
        
    },
    decreaseQuant:function(itemName){
    	console.log("Decreasing");
        var count=-1;
        var that=this;
        modelMenuOrder.getOrderItemList().forEach(function(orderitem,index)
        {
            if(orderitem.itemName==itemName)
            {
                if(modelMenuOrder.getOrderItemList()[index].quantity===1)
                {
                    that.deleteItem(itemName);
                    return true;
                }
                else{
                   count= (--modelMenuOrder.getOrderItemList()[index].quantity);
       				viewMenuOrder.showQuantity(itemName,count);
        			return true;
                }
            }
        });

        console.log(modelMenuOrder.getOrderItemList());
    },
    submit:function(){
        var ordertable=viewMenuOrder.getTable();
        if((isNaN(ordertable)) || (ordertable == " ")){
            document.getElementById("submitError").style.display = "block";
            document.getElementById("user-table").style.border = "1px solid rgb(169,68,66)";
        }
        else{
            modelMenuOrder.getOrderItemList().forEach(function(orderitem){
                orderitem.itemDescription=viewMenuOrder.getDescription(orderitem.itemName);
                orderitem.table=ordertable;
                console.log(orderitem.itemDescription);
            });
            serverServices.sendorder(modelMenuOrder.getOrderItemList(),controllerQueue.init.bind(controllerQueue));
            viewMenuOrder.menuOrderReset();
            viewMenuOrder.hidesubmit();
            this.init();
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
        menuOrderTableEl.onclick = function(event){
            event = event || window.event;
            var target = event.target;
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

