(function(){
var createCanvas=function (divName) {
		var div = document.getElementById(divName);
		var canvas = document.createElement('canvas');
		div.innerHTML='';
		div.appendChild(canvas);
		var context = canvas.getContext("2d");
		return context;
	};

/*******Graph Class and its functions********/
function Graph(divName){
		this.context=createCanvas(divName);
		this.graphName="Graph Name";
		this.canvasWidth=1000;
		this.canvasHeight = 700;
		this.xAxisLabelArr=["x1","x2","x3","x4"];
		this.yAxisLabelArr=["y1","y2","y3","y4"];
		this.backgroundColor="#E3F2FD";
	}
Graph.prototype.drawBar=function(context,xpos,ypos,width,height){
//.../
}
Graph.prototype.drawCircle=function(context,xpos,ypos,width,height){
//.../
}
Graph.prototype.controlShadow=function(OffsetX,OffsetY,Blur,Color){
	this.context.shadowOffsetX=OffsetX;
	this.context.shadowOffsetY=OffsetY;
	this.context.shadowBlur=Blur;
	this.context.shadowColor=Color;
}
Graph.prototype.gradientForBar=function(ratio,xcord,ycord,barheight,lightcolor,darkcolor){
	var gradient = this.context.createLinearGradient(0, 0, 0, this.graphAreaHeight );
	gradient.addColorStop(1-ratio, darkcolor);
	gradient.addColorStop(1, lightcolor);
	this.context.fillStyle = gradient;
	this.context.fillRect(xcord+ this.border,ycord + this.border,this.barWidth - this.border * 2,barheight - this.border * 2);
}
Graph.prototype.addText=function(text,color,font,xcord,ycord){
	this.context.fillStyle = color;
	this.context.font = font;
	this.context.textAlign = "center";
	this.context.fillText(text,xcord,ycord);	
}
Graph.prototype.setName=function(graphName){
	this.graphName=graphName;
	this.addText(this.graphName,"#9E9E9E","bold 40px sans-serif",(this.canvasWidth)/2,50);
}
Graph.prototype.clearEveryThing=function(){
	this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
}
//child class of Graph
/*******BarGraph Class and its functions********/
function BarGraph(divName){
	Graph.call(this,divName);
	this.barLengthsArr=[10,10,10,10];
	this.maxValue=100;//scaled to max 100
  	this.barMargin = 20;//distance between bars deafult value
  	this.colors = "blue";
  }
// Object.setPrototypeOf(BarGraph.prototype,Graph.prototype);//doesnot work in safari 
BarGraph.prototype=Object.create(Graph.prototype); //works everywhere
BarGraph.prototype.constructor=BarGraph;

BarGraph.prototype.animateBarGraph=function(newArr){
	//.....
	var animationsteps=20,animationinterval=100;
	var delta=[];
	for(var i=0;i<newArr.length;i+=1){
		delta.push((newArr[i]-this.barLengthsArr[i])/animationsteps);
	}
	loop.i=0;
	function loop(){
		//console.log(that.barLengthsArr)	
		if(loop.i==animationsteps){
			clearInterval(timeoutId);
			return ;
		}
		for(var i=0;i<newArr.length;i+=1){
			this.barLengthsArr[i]=this.barLengthsArr[i]+delta[i];
		}
		this.draw();
		loop.i=loop.i+1;
	}
	var timeoutId=setInterval(loop.bind(this),animationinterval);

}

BarGraph.prototype.update=function(newArr){	
	if(newArr.length===this.barLengthsArr.length){
		this.animateBarGraph(newArr);
	}
	else{
		this.barLengthsArr=newArr;
		this.draw();
	}
}

BarGraph.prototype.draw=function(){
	//clear everything on canvas (need to change this to only graph)
	  this.context.clearRect(100,100,this.canvasWidth,this.canvasHeight);//clear everything
	 //Assign dimesnsions to canvas
	 this.context.canvas.width = this.canvasWidth;
	 this.context.canvas.height = this.canvasHeight;		
	  // Draw the background color
	  this.context.fillStyle = this.backgroundColor;
	  this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	  this.graphAreaHeight=this.canvasHeight;
	  this.graphAreaWidth=this.canvasWidth;
	  
	  //If x axis labels exist then make room	
	  if (this.xAxisLabelArr.length) {
	  	this.graphAreaHeight -= 40;
	  }
	  if (this.yAxisLabelArr.length) {
	  	this.graphAreaWidth -= 40;
	  }

	 this.numOfBars=this.barLengthsArr.length;//number of bars
	 this.barWidth =this.graphAreaWidth/(2*this.numOfBars );//bar width
	 this.barMargin=this.barWidth;//space between bars
	 var maxBarHeight=this.graphAreaHeight*4/5;//scaled to this.so largest bar will be maxBarheight
	 var largestValue = 0;
	 var arr=this.barLengthsArr;
	 largestValue=arr.reduce(function(x,y){
	 	return Math.max(x,y);
	 },arr[0]);
	 
	 var i,scale,ratio;
	 //Draw each bar 
	 this.setName(this.graphName);
	 
	 for (i=0;i<arr.length;i+=1){
	 	ratio=arr[i]/largestValue;
	 	scaledBarHeight=arr[i]/largestValue * maxBarHeight;
	 	this.controlShadow(this.context,2,2,2,"#999");

	 	this.context.fillStyle="black";//rectangle outline
	 	var xcord=this.barMargin + i * this.graphAreaWidth / this.numOfBars;
	 	var ycord=this.graphAreaHeight - scaledBarHeight;
	 	this.context.fillRect(xcord,ycord,this.barWidth,scaledBarHeight);
	 	this.controlShadow(this.context,0,0,0,"#999");
	 	this.border=2;
	 	//adding only if it is visible
	 	if (scaledBarHeight > this.border * 2) {
	// apply gradient colors to 
	this.gradientForBar(ratio,xcord,ycord,scaledBarHeight,"white","red");
};	
	//Draw text above
	this.addText(parseInt(arr[i],10),"black","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord-20);
	// Draw bar label if it exists
	if (this.xAxisLabelArr[i]) {					
		this.addText(this.xAxisLabelArr[i],"violet","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord +scaledBarHeight+20);	
	};

}
}
//child class of BarGraph
/*******CompareBarGraph Class and its functions********/
function CompareBarGraph(divName){
	BarGraph.call(this,divName);
	this.secondBarLengthArr=["10,10,10,10,10"];
	this.secondBarColor="violet";
}
CompareBarGraph.prototype=Object.create(BarGraph.prototype); //works everywhere
CompareBarGraph.prototype.constructor=CompareBarGraph;

CompareBarGraph.prototype.update=function(newArr1,newArr2){	
	
	if(newArr1.length==this.barLengthsArr.length && newArr2.length===this.secondBarLengthArr.length){
		this.animateCompareBarGraph(newArr1,newArr2);
	}else{
		this.barLengthsArr=newArr1;
		this.secondBarLengthArr=newArr2;
		this.draw();
	}
}
CompareBarGraph.prototype.draw=function(){
//clear everything on canvas (need to change this to only graph)
	  this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);//clear everything
	 //Assign dimesnsions to canvas
	 this.context.canvas.width = this.canvasWidth;
	 this.context.canvas.height = this.canvasHeight;		
	  // Draw the background color
	  this.context.fillStyle = this.backgroundColor;
	  this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	  this.graphAreaHeight=this.canvasHeight;
	  this.graphAreaWidth=this.canvasWidth;
	  
	  //If x axis labels exist then make room	
	  if (this.xAxisLabelArr.length) {
	  	this.graphAreaHeight -= 40;
	  }
	  if (this.yAxisLabelArr.length) {
	  	this.graphAreaWidth -= 40;
	  }

	 this.numOfBars=this.barLengthsArr.length;//number of bars
	 this.barWidth =this.graphAreaWidth/(3*this.numOfBars );//bar width
	 this.barMargin=this.barWidth/2;//space between bars
	 var maxBarHeight=this.graphAreaHeight*4/5;//scaled to this.so largest bar will be maxBarheight
	 var largestValue = 0;
	 var arr=this.barLengthsArr;
	 var arr2=this.secondBarLengthArr;
	 largestValue=(arr.concat(arr2)).reduce(function(x,y){
	 	return Math.max(x,y);
	 },arr[0]);
	 
	 var i,scale,ratio;
	  this.setName(this.graphName);
	 //Draw each bar 	 
	 for (i=0;i<arr.length;i+=1){
	 	ratio=arr[i]/largestValue;
	 	scaledBarHeight=arr[i]/largestValue * maxBarHeight;

	 	ratio2=arr2[i]/largestValue;
	 	scaledBarHeight2=arr2[i]/largestValue * maxBarHeight;


	 	this.controlShadow(this.context,2,2,2,"#999");

	 	this.context.fillStyle="black";//rectangle outline
	 	var xcord=this.barMargin + i * this.graphAreaWidth / this.numOfBars;
	 	var ycord=this.graphAreaHeight - scaledBarHeight;
	 	this.context.fillRect(xcord,ycord,this.barWidth,scaledBarHeight);

	 	var xcord2=this.barMargin + i * this.graphAreaWidth / this.numOfBars+this.barWidth;
	 	var ycord2=this.graphAreaHeight - scaledBarHeight2;
	 	this.context.fillRect(xcord2,ycord2,this.barWidth,scaledBarHeight2);

	 	this.controlShadow(this.context,0,0,0,"#999");
	 	this.border=1;
	 	//adding only if it is visible
	 	if (scaledBarHeight > this.border * 2) {
		// apply gradient colors to 
		this.gradientForBar(ratio,xcord,ycord,scaledBarHeight,"white","red");
		this.gradientForBar(ratio,xcord2,ycord2,scaledBarHeight2,"white","blue");
	};	
		//Draw text above
		this.addText(parseInt(arr[i],10),"black","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord-20);
		this.addText(parseInt(arr2[i],10),"black","bold 12px sans-serif",xcord2+this.barWidth*(1/3),ycord2-20);
		// Draw bar label if it exists
		if (this.xAxisLabelArr[i]) {					
			this.addText(this.xAxisLabelArr[i],"violet","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord +scaledBarHeight+20);
		//this.addText(this.xAxisLabelArr[i],"violet","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord +scaledBarHeight+20);		
	};
}
}
CompareBarGraph.prototype.animateCompareBarGraph=function(newArr1,newArr2){
	var animationsteps=20,animationinterval=100;
	var delta1=[];
	var delta2=[];
	for(var i=0;i<newArr1.length;i+=1){
		delta1.push((newArr1[i]-this.barLengthsArr[i])/animationsteps);
		delta2.push((newArr2[i]-this.secondBarLengthArr[i])/animationsteps);
	}
	//var that=this;
	loop.i=0;
	function loop(){
		//console.log(that.barLengthsArr)
		if(loop.i==animationsteps){
			clearInterval(timeoutId);
			return ;
		}
		for(var i=0;i<newArr1.length;i+=1){
			this.barLengthsArr[i]=this.barLengthsArr[i]+delta1[i];
			this.secondBarLengthArr[i]=this.secondBarLengthArr[i]+delta2[i];
		}
		this.draw();
		loop.i=loop.i+1;
	}
	var timeoutId=setInterval(loop.bind(this),animationinterval);
}



var model={
	init:function(){
		model.currentGraph.category="Snacks";
		model.currentGraph.categoryItem="Maggi"
	}
	,
	currentGraph:{
		category:"Snacks",
		categoryItem:"Maggi"
	},
	orders :[
	{
		uid: "113352049485747139246",
		orderId:1,
		orderNo:1,
		orderName: "Vishwa",
		table: 9,
		itemName: "Cornflakes",
		quantity: 1,
		itemDescription: "cold",
		status: "Queued",
	},
	{
		uid: "113352049485747139246",
		orderId:2,
		orderNo:1,
		orderName: "Vishwa",
		table: 9,
		itemName: "Chocos",
		quantity: 1,
		itemDescription: "cold",
		status: "Queued",
	},
	{
		uid: "113352049485747139246",
		orderId:3,
		orderNo:2,
		orderName: "Anup",
		table: 9,
		itemName: "Maggi",
		quantity: 1,
		itemDescription: "-",
		status: "Queued",
	},
	{
		uid: "113352049485747139246",
		orderId:4,
		orderNo:2,
		orderName: "Anup",
		table: 9,
		itemName: "Tea",
		quantity: 1,
		itemDescription: "cold",
		status: "Queued",
	},
	{
		uid: "113352049485747139246",
		orderId:5,
		orderNo:3,
		orderName: "Akshat",
		table: 9,
		itemName: "Cornflakes",
		quantity: 1,
		itemDescription: "cold",
		status: "Queued",
	},
	{
		uid: "113352049485747139246",
		orderId:6,
		orderNo:3,
		orderName: "Akshat",
		table: 9,
		itemName: "Chocos",
		quantity: 1,
		itemDescription: "cold",
		status: "Queued",
	},

	],


	menu :[
	{
		category: "Bevarages",
		categoryItems: [
		{
			itemName: "Tea",
			available: false,
			imgSrc: "assets/defaultItem.png"
		},
		{
			itemName: "Coffee",
			available: true,
			imgSrc: "assets/defaultItem.png"

		},
		{
			itemName: "Bournvita",
			available:true,
			imgSrc: "assets/defaultItem.png"

		},
		{
			itemName: "Boost",
			available:true,
			imgSrc: "assets/defaultItem.png"

		}
		]
	},
	{
		category: "Snacks",
		categoryItems: [
		{
			itemName: "Maggi",
			available: false,
			imgSrc: "assets/defaultItem.png"

		},
		{
			itemName: "Chocos",
			available: true,
			imgSrc: "assets/defaultItem.png"

		},
		{
			itemName: "Cornflakes",
			available:true,
			imgSrc: "assets/defaultItem.png"

		},
		{
			itemName: "Eggs",
			available:true,
			imgSrc: "assets/defaultItem.png"

		}
		]
	}
	]
}



var controller={
	init:function(){
		model.init();
		/***

		update model from server

		***/
		controller.setBarGraphArray();
		graphView.init();
		view.init();
	},
	getAllordersPlaced:function(){
		return model.orders
	},
	getOrdersQuantity:function(itemName,status){
		return model.orders.reduce(function(x,y){
			if(itemName==y.itemName && status==y.status) x=x+parseInt(y.quantity);
		},0)
	},
	getOrdersByType:function(itemName){
		return model.orders.filter(function(x){
			return x.itemName==itemName;
		})
	},
	getAllDeliveredOrders:function(){
		return model.orders.filter(function(x){
			return x.status=="Delivered";
		});
	},
	getAllCancelledOrders:function(){
		return model.orders.filter(function(x){
			return x.status=="cancelled";
		});
	},
	getAllQueuedOrders:function(){
		return model.orders.filter(function(x){
			return x.status=="Queued";
		});
	},
	getAllMenu:function(){
		return model.menu;
	},
	setCurrentGraph:function(category,item){
		model.currentGraph.category=category;
		model.currentGraph.categoryItem=item;
	},
	setBarGraphArray:function(){
		console.log("setting Bar Graph Array");
	},
	itemClicked:function(category,item){
		controller.setCurrentGraph(category,item);
		controller.setBarGraphArray();
		//set BarGraph arrays
		graphView.render();
	},
	day:["sun","mon","tue","wed","thur","fri","sat"]
	,
	setxLabelArray:function(){
		var dayint=(new Date()).getDay();
		var arr=controller.day.map(function(x,index){
			return controller.day[(dayint+1+index)%7]
		})
		console.log(dayint+arr)
		graphView.xAxisLabelArr=arr;
		/**
		setLastweek array
		**/
	},


}
var view ={
	init:function(){
		this.bevarageElement=document.getElementById("Bevarages");
		this.snackElement=document.getElementById("Snacks");
		view.render();
	},
	//need to change
	updateMenu:function(){
		var allMenu=controller.getAllMenu();
		var BevarageItems=allMenu[0].categoryItems;
		var eachCategoryItem;
		for(var i=0;i<BevarageItems.length;i+=1){
			eachCategoryItem=document.createElement('a');
			eachCategoryItem.setAttribute('href',"#");
			eachCategoryItem.setAttribute('Id',BevarageItems[i].itemName);
			eachCategoryItem.innerHTML =BevarageItems[i].itemName;
			eachCategoryItem.addEventListener('click',
				(function(categorycopy,itemcopy) {
					return function() {
						
						controller.itemClicked(categorycopy,itemcopy);
					};
				})("Bevarages",BevarageItems[i].itemName))


			this.bevarageElement.appendChild(eachCategoryItem);

		}
		var SnackItems=allMenu[1].categoryItems;

		for(var i=0;i<SnackItems.length;i+=1){
			eachCategoryItem=document.createElement('a');
			eachCategoryItem.setAttribute('href',"#");
			eachCategoryItem.setAttribute('id',SnackItems[i].itemName);
			eachCategoryItem.innerHTML =SnackItems[i].itemName;
			eachCategoryItem.addEventListener('click',
				(function(categorycopy,itemcopy) {
					return function() {
						
						controller.itemClicked(categorycopy,itemcopy);
					};
				})("Snacks",SnackItems[i].itemName))

			this.snackElement.appendChild(eachCategoryItem);
       		   // console.log(eachCategoryItem)
       		}
       	},
       	render:function(){
       		view.updateMenu();
       	}
       }
 var graphView={
 		init:function(){
 			controller.setxLabelArray();
 			graphView.render();
 		},
       	render:function(){
  
       		console.log(model.currentGraph);
       		var bgraph= new BarGraph("BarGraph1");
			bgraph.xAxisLabelArr=graphView.xAxisLabelArr;
			bgraph.graphName="Consumption Graph";
			bgraph.update(graphView.barValuesSimple);

			var bgraph2=new CompareBarGraph("BarGraph2");
			bgraph2.xAxisLabelArr=graphView.xAxisLabelArr;
			bgraph2.graphName="ConsumptionCompareGraph"
			bgraph2.update(graphView.barValuesDouble.first,graphView.barValuesDouble.second);
			
       	},

       	xAxisLabelArr:["sun","mon","tue","wed","thur","fri","sat"],
       	barValuesSimple:[10,20,30,40,50,60,70],
       	barValuesDouble:{
       		first:[40,20,30,40,50,60,70],
       		second:[10,20,30,40,50,60,70],
       	},
       };
 controller.init();

   })();
