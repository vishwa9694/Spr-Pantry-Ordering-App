var modelItems={
init:function(){
	this.item=serverServices.getItems();
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



var itemListView = {
    init: function(){
        var menu;
        this.menuList = document.getElementById("menuList");
        console.log("   asfa:"+this.menuList);
        //this.render();
        menu = document.getElementsByClassName("menu")[0];
        menu.onclick = function(e) {
            e = e || event
            var target = e.target;
            var itemName=target.id.split("_")[1];
            if(e.target.id.indexOf("Click")>=0)
            {
                controllerMenuOrder.updateItem(itemName);
            }
        }
    },
 
    addCategory: function(categoryName){
        this.category=document.createElement("div");
        this.category.className="category";
        this.category.id=categoryName;
        this.header = document.createElement("div");
        this.header.className="category__header";
        this.header.id=categoryName+"__header"
        this.header.innerHTML = categoryName;
        console.log("category header id "+this.header.id);
        this.categoryContainer = document.createElement("div");
        this.categoryContainer.className="category__container";
        this.categoryContainer.id=categoryName+"__container";
        this.menuList.appendChild(this.category);
        this.category.appendChild(this.header);
        this.category.appendChild(this.categoryContainer);
    },
    addItem:function(iName,iAvailable,iImg,categoryHeader,catIndex,iIndex){
        itemDiv=document.createElement("div");
        itemDiv.className="category__item";
        itemDiv.innerHTML = '<img src=' + iImg + ' class="category__item__image">' +
            '<div class="category__item__hover">' +
            '<i class="fa fa-plus-circle fa-3x ci__hover__click" id="Click_'+iName+'"></i>' +
            '</div>' +
            '<div class="category__item__name" data-type=' +iAvailable+ ' id="tileName_'+iIndex+'">' + iName + '</div>';
        console.log("Cat header "+categoryHeader);
        var categoryDiv=document.getElementById(categoryHeader+"__container");
        console.log("categoryheader id is "+categoryDiv.id);
        categoryDiv.appendChild(itemDiv);
      
       
    }  
       
    };
