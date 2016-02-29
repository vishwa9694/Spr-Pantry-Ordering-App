var modelItems={
init:function(){

	this.item=serverServices.getItems();
}
};


var itemListController = {
    
    init: function(){
        itemListView.init();

        var category,iIndex;
        category=modelItems.item;
        iIndex=0;
        category.forEach(function(menu)
        {
            itemListView.addCategory(menu.category);
            
            menu.categoryItems.forEach(function(categoryItem,iIndex)
            {
            	console.log(categoryItem.itemName+","+categoryItem.available+","+categoryItem.imgSrc+","+menu.category+","+iIndex);
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
        console.log("   asfa:"+this.menuList);
        this.menuListEl.onclick = function(event) {
            event = event || window.event;
            var target = event.target;
            var itemName=target.id.split("_")[1];
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
        categoryEl.id=categoryName;
        headerEl = document.createElement("div");
        headerEl.className="category__header";
        headerEl.id=categoryName+"__header"
        headerEl.innerHTML = categoryName;
        console.log("category header id "+headerEl.id);
        categoryContainerEl = document.createElement("div");
        categoryContainerEl.className="category__container";
        categoryContainerEl.id=categoryName+"__container";
        categoryEl.appendChild(headerEl);
        categoryEl.appendChild(categoryContainerEl);
        this.menuListEl.appendChild(categoryEl);
       
    },
    addItem:function(itemProps,iIndex){
        var itemDivEl,categoryDivEl;
        itemDivEl=document.createElement("div");
        itemDivEl.className="category__item";
        itemDivEl.innerHTML = '<img src=' + itemProps.imgSrc + ' class="category__item__image">' +
            '<div class="category__item__hover">' +
            '<i class="fa fa-plus-circle fa-3x ci__hover__click" id="Click_'+itemProps.name+'"></i>' +
            '</div>' +
            '<div class="category__item__name" data-type=' +itemProps.available+ ' id="tileName_'+iIndex+'">' + itemProps.name + '</div>';
        console.log("Cat header "+itemProps.header);
        categoryDivEl=document.getElementById(itemProps.header+"__container");
        console.log("categoryheader id is "+categoryDivEl.id);
        categoryDivEl.appendChild(itemDivEl);
      
       
    } ,
    reset:function(){
        this.menuList = document.getElementById("menuList");
        this.menuList.innerHTML=" ";
    } 
       
    };
