
var controllerQueue={

renderQueue:function(){
	console.log("this is model order "+modelOrder.order);
	viewQueue.init();
	if(!(modelOrder.order===null||modelOrder.order===undefined))
	{
		modelOrder.order.forEach(function(orderItem,index){
		console.log(orderItem.orderId);
			viewQueue.addOrder(orderItem.orderName,orderItem.itemName,orderItem.status,orderItem.orderId)
		
	});
	}
	else
	{
		console.log("No Object man");
	//	viewQueue.orderEmpty();
	}
	},


deleteOrder:function(cancelrequest){
		cancelrequest=parseInt(cancelrequest);
		var serviceret=serverServices.cancelOrder(cancelrequest);
		if(serviceret===true)
		{
			modelOrder.order.forEach(function(orderitem){
				console.log(orderitem.orderId+" "+cancelrequest);
				if(orderitem.orderId===cancelrequest)
					orderitem.status="Cancelled";
			});
			console.log(modelOrder.order);
			viewQueue.ordertableReset();
			this.renderQueue();			
		}
		else
		{
			console.log("fjan");
		}

	}


};

var controllerMenuOrder={


    init:function()
    {
        modelmenuOrder.init();
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
        viewMenuOrder.addItem(itemname);
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

var itemListController = {
    
    init: function(){
        itemListView.init();
        var category=modelItems.item;
        var iIndex=0;
        category.forEach(function(menu,catIndex)
        {
            itemListView.addCategory(menu.category,catIndex);
            
            menu.categoryItems.forEach(function(categoryItem)
            {
            	console.log(categoryItem.itemName+","+categoryItem.available+","+categoryItem.imgSrc+","+menu.category+","+catIndex+","+iIndex);
                itemListView.addItem(categoryItem.itemName,categoryItem.available,categoryItem.imgSrc,menu.category,catIndex,iIndex);
                iIndex++
            });
        });
    }
};



var controllerMain={
	init:function(){
		console.log("Hello");
		
		modelOrder.init();
		controllerQueue.renderQueue();

		modelItems.init();
		itemListController.init();

		controllerMenuOrder.init();
		viewMenuOrder.init();




	}
};
controllerMain.init();
