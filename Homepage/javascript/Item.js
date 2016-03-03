var modelItems={
init:function(callBackFunction){
    serverServices.getItems(callBackFunction);
},
getItems:function(){
    return this.items;
},
setItems:function(item){
    this.items=item;
}
};


var itemListController = {
    
    init: function(){
        modelItems.init(this.serverCallBack.bind(this));
        itemListView.init();
        itemListView.reset();
        
    },
    serverCallBack:function(items){
        modelItems.setItems(items);
        this.render();
    },
    render:function(){
        var category, iIndex;
        category=modelItems.getItems();
        iIndex=0;
        category.forEach(function(menu,catIndex)
        {
            itemListView.addCategory(menu.category);
            
            menu.categoryItems.forEach(function(categoryItem,iIndex){
                var itemProps={ "name":categoryItem.itemName,
                    "available":categoryItem.available,
                    "imgSrc":categoryItem.imgSrc,
                    "header":menu.category
                }
                itemListView.addItem(itemProps,iIndex);
                iIndex++
            });
        });
    },
};



var itemListView = {
    init: function(){
        this.menuListEl = document.getElementById("menuList");
        this.menuListEl.onclick = function(event) {
            var target, itemName;
            event = event || window.event;
            target = event.target;
            itemName=target.id.split("_")[1];
            if(target.id.indexOf("Click")>=0)
            {
                controllerMenuOrder.updateItem(itemName);
            }
        }
    },
 
    addCategory: function(categoryName){
        var categoryEl,headerEl,categoryContainerEl;
        categoryEl=document.createElement("div");
        categoryEl.className="category";
        if(!document.getElementById(categoryName)){
            categoryEl.id=categoryName;
            categoryEl.innerHTML= '<div class="category__header" id="'+categoryName+'__header">'+categoryName+'</div>'+
                                    '<div class="category__container" id="'+categoryName+'__container"></div>'
            this.menuListEl.appendChild(categoryEl);
        }
       
       
    },
    addItem:function(itemProps,iIndex){
        if(itemProps.available==true){
            var itemDivEl,categoryDivEl;
            itemDivEl=document.createElement("div");
            itemDivEl.className="category__item";
            itemDivEl.innerHTML = '<img src=' + itemProps.imgSrc + ' class="category__item__image">' +
                '<div class="category__item__hover">' +
                '<i class="fa fa-plus-circle fa-3x ci__hover__click" id="Click_'+itemProps.name+'"></i>' +
                '</div>' +
                '<div class="category__item__name" data-type=' +itemProps.available+ ' id="tileName_'+iIndex+'">' + itemProps.name + '</div>';
            categoryDivEl=document.getElementById(itemProps.header+"__container");
            categoryDivEl.appendChild(itemDivEl);
      }
       
    } ,
    reset:function(){
        this.menuListEl.innerHTML=" ";
    } 
       
    };
