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
		this.backgroundColor="#ffffff";
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
	this.addText(this.graphName,"#ffffff"," 40px sans-serif",(this.canvasWidth)/2,50);
}
Graph.prototype.clearEveryThing=function(){
	this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
}
Graph.prototype.drawAxis=function(){
	//alert("hola")
	var height=this.canvasHeight;
	var width=this.canvasWidth;
	var ctx=this.context;
	ctx.beginPath();
	ctx.moveTo(0,height-35);
	ctx.lineTo(width-10,height-35);
	ctx.moveTo(10,height-15)
	ctx.lineTo(10,15);
	ctx.stroke();

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
	var animationsteps=20,animationinterval=50;
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
	  // if (this.xAxisLabelArr.length) {
	  	this.graphAreaHeight -= 40;
	  // }
	  //if (this.yAxisLabelArr.length) {
	  	this.graphAreaWidth -= 40;
	  // }

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
	this.addText(parseInt(arr[i],10),"black"," 12px sans-serif",xcord+this.barWidth*(1/3),ycord-20);
	// Draw bar label if it exists
	if (this.xAxisLabelArr[i]) {					
		this.addText(this.xAxisLabelArr[i],"black","bold 12px sans-serif",xcord+this.barWidth*(1/3),ycord +scaledBarHeight+20);	
	};

	this.drawAxis();

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
	  // if (this.xAxisLabelArr.length) {
	  	this.graphAreaHeight -= 40;
	  // }
	  // if (this.yAxisLabelArr.length) {
	  	this.graphAreaWidth -= 40;
	  // }

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
		};
		this.drawAxis();
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
function getLast7daysDate() {
	var lastSevenDays=[];
	for(var i=0;i<7;i++){
		var toDay=new Date();
		toDay.setDate(toDay.getDate()-i)
			//console.log(toDay)
			lastSevenDays.push(toDay.getDate() + '/' + (toDay.getMonth()+1))
		}
		return lastSevenDays;
	}
	function getLast7daysDateObject() {
		var lastSevenDays=[];
		for(var i=0;i<7;i++){
			var toDay=new Date();
			toDay.setDate(toDay.getDate()-i)
			lastSevenDays.push(toDay.getDate() + '/' + (toDay.getMonth()+1)+'/'+toDay.getFullYear())
		}
		return lastSevenDays;
	}
	function getWeekNumber(givendate) {
		var date = new Date(givendate);
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		var week1 = new Date(date.getFullYear(), 0, 4);
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
			- 3 + (week1.getDay() + 6) % 7) / 7);
	}
	function getLast4WeeksDate(){
		var i=getWeekNumber(new Date());
		var lastFourWeeks=[i,i-1,i-2,i-3];	
	//console.log(lastFourWeeks);
	return lastFourWeeks;
}



var model={
	init:function(){	
		model.currentGraph.category="Snacks";
		model.currentGraph.categoryItem="Maggi"
	},
	currentGraph:{
		category:"Snacks",
		categoryItem:"Maggi"
	},
	getCurrentItem:function(){
		return model.currentGraph.categoryItem;
	}
	,
	orders :[
	{
		uid: "113352049485747139246",
		orderId:1,
		orderNo:1,
		orderName: "Vishwa",
		table: 9,
		itemName: "Maggi",
		quantity: 1,
		itemDescription: "cold",
		status: "Completed",
		itemPlacedOn:"Tue Mar 01 2016 08:55:40 GMT+0530 (IST)",
		deliveredOn:""

	},
	{
		uid: "113352049485747139246",
		orderId:1,
		orderNo:1,
		orderName: "Vishwa",
		table: 9,
		itemName: "Maggi",
		quantity: 1,
		itemDescription: "cold",
		status: "Completed",
		itemPlacedOn:"Mon Feb 15 2016 08:55:40 GMT+0530 (IST)",
		deliveredOn:""

	},
	{
		uid: "113352049485747139246",
		orderId:1,
		orderNo:1,
		orderName: "Vishwa",
		table: 9,
		itemName: "Maggi",
		quantity: 1,
		itemDescription: "cold",
		status: "Completed",
		itemPlacedOn:"Mon Feb 22 2016 08:55:40 GMT+0530 (IST)",
		deliveredOn:""

	},
	],
	menu : [
	{
		category: "Beverages",
		categoryItems: [
		{
			itemName: "Tea",
			available: true,
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

		}
		]
	},
	{
		category: "Snacks",
		categoryItems: [
		{
			itemName: "Maggi",
			available: true,
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

		}
		]
	}
	]
}



var controller={
	init:function(){
		model.init();
		services.createRequest("GET","/getAllOrders",controller.updateOrders);
		services.createRequest("GET","/getAllMenu",controller.updateMenuItems);			
	},
	afterUpdated:function(){
		view.init();
		graphView.init();
		
	},
	updateOrders:function(updatedorders){
		model.orders=JSON.parse(updatedorders);
	},
	updateMenuItems:function(updatedMenu){
		model.menu=JSON.parse(updatedMenu);
		controller.afterUpdated();	
	},

	getOrdersQuantityArrayBydate:function(ordersArr,startTime,endTime){
		var arr=[];
		var first=(new Date(startTime)).getTime();
		var last=(new Date(endTime)).getTime();
		var len =parseInt((last-first)/(24*60*60*1000));
		for(var i=0;i<len;i++)arr[i]=0;
			//console.log(len);
		//console.log(arr)
		ordersArr.forEach(function(x){
			var itemTime=(new Date(x.itemPlacedOn)).getTime();
			var index=parseInt((last-itemTime)/(24*60*60*1000))
			arr[index]=arr[index]+x.quantity;
		});
		return arr;
	},
	getOrdersByType:function(itemName){
		return model.orders.filter(function(x){
			return x.itemName==itemName;
		})
	},
	getAllOrdersByTypeByTimeByStatus:function(itemName,itemStatus,startTime,endTime){
		return model.orders.filter(function(x){
			var  first=(new Date(startTime)).getTime();
			var  last=(new Date(endTime)).getTime();
			var  itemTime=(new Date(x.itemPlacedOn)).getTime();

			var f = itemTime >= first && itemTime <= last;

			return (x.itemName==itemName && (x.status==itemStatus || itemStatus=="") && f); 
		})
	},
	getAllMenu:function(){
		return model.menu;
	},
	setCurrentGraph:function(category,item){
		model.currentGraph.category=category;
		model.currentGraph.categoryItem=item;
	},
	setBarGraphArray:function(days){
		graphView.resetGraphBarArrays();
		var toDay=new Date();
		var from=new Date();
		if(typeof days=='undefined')days=7;
		from.setDate(toDay.getDay()-(days+1));

		var ordersArr=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"",from,toDay);
		graphView.setFirstBarValues(controller.getOrdersQuantityArrayBydate(ordersArr,from,toDay));
		//console.log(controller.getOrdersQuantityArrayBydate(ordersArr,from,toDay));

		var ordersArr1=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"Completed",from,toDay);
		ordersArr1=controller.getOrdersQuantityArrayBydate(ordersArr1,from,toDay)
		var ordersArr2=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"Cancelled",from,toDay);
		ordersArr2=controller.getOrdersQuantityArrayBydate(ordersArr2,from,toDay)
		//console.log(ordersArr1)
		//console.log(ordersArr2)
		graphView.setSecondBarValues(ordersArr1,ordersArr2);;
	},
	setBarGraphArrayWithFromTill:function(from,till){
		graphView.resetGraphBarArrays();
		var tillDate=new Date(till);
		var fromDate=new Date(from);
		//if(typeof days=='undefined')days=7;
		//from.setDate(toDay.getDay()-(days+1));
		console.log("from:"+fromDate)
		console.log("till:"+tillDate)
		var ordersArr=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"",fromDate,tillDate);
		graphView.setFirstBarValues(controller.getOrdersQuantityArrayBydate(ordersArr,fromDate,tillDate));
		//console.log(controller.getOrdersQuantityArrayBydate(ordersArr,from,toDay));

		var ordersArr1=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"Completed",fromDate,tillDate);
		ordersArr1=controller.getOrdersQuantityArrayBydate(ordersArr1,fromDate,tillDate)
		var ordersArr2=controller.getAllOrdersByTypeByTimeByStatus(model.getCurrentItem(),"Cancelled",fromDate,tillDate);
		ordersArr2=controller.getOrdersQuantityArrayBydate(ordersArr2,fromDate,tillDate)
		//console.log(ordersArr1)
		//console.log(ordersArr2)
		graphView.setSecondBarValues(ordersArr1,ordersArr2);;
	},
	itemClicked:function(category,item){
		controller.changeHeading(item);
		controller.setCurrentGraph(category,item);
		controller.setBarGraphArray();
		graphView.render();
	},
	dateSelected:function(from,till){
		controller.setBarGraphArrayWithFromTill(from,till);
		graphView.render();
	}
	,
	changeToWeeks:function(){
		var arr=getLast4WeeksDate();
		var xary=[0,0,0,0];
		var xaryDelivered=[0,0,0,0];
		var xaryNotdelivered=[0,0,0,0];
		controller.getOrdersByType(model.currentGraph.categoryItem).forEach(function(x){
			var i=getWeekNumber(new Date(x.itemPlacedOn));
			for(var z=0;z<4;z++){
				if(i==arr[z]){
					xary[z]=xary[z]+parseInt(x.quantity);
					if(x.status=="Completed")xaryDelivered[z]=xaryDelivered[z]+parseInt(x.quantity)
						else xaryNotdelivered[z]=xaryNotdelivered[z]+parseInt(x.quantity)
					}
			}
		})
		graphView.barValuesSimple=xary;
		graphView.barValuesDouble.first=xaryDelivered;
		graphView.barValuesDouble.second=xaryNotdelivered;	
		graphView.xAxisLabelArr=["currentWeek","LastWeek","LastButOneWeek","LastButTwoWeek"];
		graphView.render();
	},
	changeToDays :function(){
		controller.afterUpdated();
	}
	,
	changeHeading:function(item){
		document.getElementById("header_name").innerHTML="STATS FOR "+item.toUpperCase();
	}
	,
	
	setxLabelArray:function(){	
		graphView.xAxisLabelArr=getLast7daysDate();
	},
	day:["sun","mon","tue","wed","thur","fri","sat"]
	,
}
var view ={
	init:function(){
		this.bevarageElement=document.getElementById("Beverages");
		this.snackElement=document.getElementById("Snacks");
		view.addClickeventstoButtons();
		view.render();
	},
	addClickeventstoButtons:function(){
		this.buttonGraph1days=document.getElementById("button_days_consumtion");
		this.buttonGraph1weeks=document.getElementById("button_weeks_consumtion");
		this.buttonGraph2days=document.getElementById("button_days_compare_consumtion");
		this.buttonGraph2weeks=document.getElementById("button_weeks_compare_consumtion");
		console.log(document.getElementById("dateselector"))
		document.getElementById("dateselector").addEventListener('click',view.getDateSelected);
		

		this.buttonGraph1days.addEventListener('click',function(){
			controller.changeToDays();
		});
		this.buttonGraph1weeks.addEventListener('click',function(){
			controller.changeToWeeks();
		});
		this.buttonGraph2days.addEventListener('click',function(){
			controller.changeToDays();
		});
		this.buttonGraph2weeks.addEventListener('click',function(){
			controller.changeToWeeks();
		});
		
	},
	getDateSelected:function (event)
	{
		event.preventDefault();
		var myDate=document.getElementById("From1").value;//2016-03-01 
		console.log(myDate+"   TO");
		myDate=myDate.split("-");
		var newDate=myDate[1]+","+myDate[2]+","+myDate[0];
		console.log(newDate)
		var from=new Date(newDate).getTime();

		var myDate=document.getElementById("Till1").value;
		myDate=myDate.split("-");
		var newDate=myDate[1]+","+myDate[2]+","+myDate[0];
		var till=new Date(newDate).getTime();
		till=till+24*60*60*1000;

		if(till < from  ) alert("select a valid date ");

		controller.dateSelected(from,till);

	}
	,
	//need to change this function 
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
				})("Beverages",BevarageItems[i].itemName))
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
       		controller.setBarGraphArray();
       		controller.setxLabelArray();
       		graphView.render();
       	},
       	render:function(){

       		//console.log("Model Graph:"+model.currentGraph);
       		var bgraph= new BarGraph("BarGraph1");
       		bgraph.xAxisLabelArr=graphView.xAxisLabelArr;
       		bgraph.graphName="Total Items Placed ";
       		bgraph.update(graphView.barValuesSimple);

       		var bgraph2=new CompareBarGraph("BarGraph2");
       		bgraph2.xAxisLabelArr=graphView.xAxisLabelArr;
       		bgraph2.graphName="Items Delivered  vs Not delivered"
       		bgraph2.update(graphView.barValuesDouble.first,graphView.barValuesDouble.second);

       	},
       	resetGraphBarArrays:function(){
       		graphView.barValuesSimple=[0,0,0,0,0,0,0];
       		graphView.barValuesDouble.first=[0,0,0,0,0,0,0];
       		graphView.barValuesDouble.second=[0,0,0,0,0,0,0];
       	},
       	setFirstBarValues:function(arr){
       		graphView.barValuesSimple=arr;
       	},
       	setSecondBarValues:function(arr1,arr2){
       		graphView.barValuesDouble.first=arr1;
       		graphView.barValuesDouble.second=arr2;
       	}
       	,
       	xAxisLabelArr:["sun","mon","tue","wed","thur","fri","sat"]
       	,
       	barValuesSimple:[0,0,0,0,0,0,0]
       	,
       	barValuesDouble:{
       		first:[0,0,0,0,0,0,0],
       		second:[0,0,0,0,0,0,0],
       	},
       };
       controller.init();

   })();
