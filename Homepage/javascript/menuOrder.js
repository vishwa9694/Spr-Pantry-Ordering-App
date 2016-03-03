
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
        modelMenuOrder.getOrderItemList().forEach(function(orderitem){
            viewMenuOrder.addItem(orderitem.itemName,orderitem.quantity);
        });
    },
    updateItem:function(name){
        var that=this;
        var found=false;
        modelMenuOrder.getOrderItemList().forEach(function(menuitem,id){
            if(menuitem.itemName===name){
              found=true;
              that.increaseQuant(name);
          }
      });
        if(found===false){
            this.addItem(name);
        }
    },
    addItem:function(itemname){
        var neworderitem;
        if(modelMenuOrder.getOrderItemList().length===0&&!(login.user.id===null||login.user.id===undefined)){
            viewMenuOrder.showsubmit();
        }
        neworderitem={
            uid:login.user.id,
            orderName:login.user.name,
            itemName:itemname,
            table:0,
            quantity:1
        };
        modelMenuOrder.getOrderItemList().push(neworderitem);
        viewMenuOrder.addItem(itemname,1);
        return modelMenuOrder.getOrderItemList().length-1;
        
    },
    deleteItem:function(itemName){
        modelMenuOrder.getOrderItemList().forEach(function(orderitem,index)
        {
            if(orderitem.itemName===itemName)
            {
                modelMenuOrder.getOrderItemList().splice(index,1);
            }
        });
        viewMenuOrder.menuOrderReset();
        this.render();
        if(modelMenuOrder.getOrderItemList().length===0){
            viewMenuOrder.hidesubmit();
        }

    },

    increaseQuant:function(itemName){
        var count=-1; 
        modelMenuOrder.getOrderItemList().forEach(function(orderitem,index){
            if(orderitem.itemName===itemName){
                count=(++modelMenuOrder.getOrderItemList()[index].quantity);
            }
        });
        viewMenuOrder.showQuantity(itemName,count);
    },

    decreaseQuant:function(itemName){
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
        var ordersDiv=document.querySelector(".s-o__element");
        menuTableDivEl = ordersDiv.querySelector("#menuOrderDiv");
        menuOrderTableEl = ordersDiv.querySelector("#menuOrder");
        tableNoEl = ordersDiv.querySelector("#user-table");
        this.addEventListener();   
    },
    addEventListener: function(){
        menuOrderTableEl.onclick = function(event){
            var target,action;
            event = event || window.event;
            target = event.target;
            action=target.getAttribute("data-action");
            switch(action){
                case "cancel":
                    controllerMenuOrder.deleteItem(target.id.split("_")[1]);
                    break;

                case "increase-quantity":
                    controllerMenuOrder.increaseQuant(target.id.split("_")[1]);
                    break;

                case "decrease-quantity":
                    controllerMenuOrder.decreaseQuant(target.id.split("_")[1]);
                    break;
            }
        }
    },

    itemNameInnerHTML: function(itemName){
        return '<i class="fa fa-times-circle fa-lg itemCancel" id="cancel_'+itemName+'" data-action="cancel"></i><span>' + itemName + '</span>';
    },

    buttonInnerHTML: function(itemName,dataAction){
        if(dataAction=="increase-quantity"){
            return '<button classs="add-but adder" id="add_'+itemName+'" data-action="increase-quantity">+</button>';
        }

        else if(dataAction=="decrease-quantity"){
            return '<button classs="add-but sub" id="sub_'+itemName+'" data-action="decrease-quantity">-</button>';
        }
    },

    specialInstructionsInnerHTML: function(name){
        return '<input class="in_comment" placeholder="Special Instructions" id="special_'+name+'"/>';
    },


    createButtonCol : function (dom,attr,field,itemName) {
        dom.setAttribute(attr,field);
        dom.innerHTML = this.buttonInnerHTML(itemName,dom.getAttribute(attr));
        this.menuOrderRowEl.appendChild(dom);
    },

    createNameCol : function(dom,itemName,className){
        dom.className=className;
        dom.innerHTML = this.itemNameInnerHTML(itemName);
        this.menuOrderRowEl.appendChild(dom);
    },
    
    addItem: function(name,qty){
        this.menuOrderRowEl = document.createElement("tr");
        this.menuOrderRowEl.setAttribute('class', 's-o-e__item');
        
        // Name Adder
        var menuOrderItemNameEl = document.createElement("td");
        this.createNameCol(menuOrderItemNameEl,name,"item__name");
    
        //Add button adder
        var menuOrderAddEl = document.createElement("td");
        this.createButtonCol (menuOrderAddEl,"data-action","increase-quantity",name);

        //Add the quantity
        var menuOrderQtyEl = document.createElement("td");
        var quantityID="qty_"+name;
        menuOrderQtyEl.setAttribute('class', 'item-qty');
        menuOrderQtyEl.setAttribute('id', 'qty_'+name);
        menuOrderQtyEl.innerHTML = qty;
        this.menuOrderRowEl.appendChild(menuOrderQtyEl);

        //Remove an item (Subtract the quantity)
        var menuOrderRemEl = document.createElement("td");
        this.createButtonCol(menuOrderRemEl,"data-action","decrease-quantity",name);

        //Special Instructions
        var menuOrderSplInsEl = document.createElement("td");
        menuOrderSplInsEl.setAttribute('class', 'item-comment');
        menuOrderSplInsEl.innerHTML = viewMenuOrder.specialInstructionsInnerHTML(name);
        this.menuOrderRowEl.appendChild(menuOrderSplInsEl);

        //Finally adding the row to the table
        menuOrderTableEl.appendChild(this.menuOrderRowEl);
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

  showsubmit:function(){
    document.getElementsByClassName("user-form")[0].style.display="block";
},

hidesubmit:function(){
    document.getElementsByClassName("user-form")[0].style.display="none";
}
};

