
var createCanvas=function (divName) {
			var div = document.getElementById(divName);
			var canvas = document.createElement('canvas');
			div.appendChild(canvas);
			var context = canvas.getContext("2d");
			return context;
		};

function Graph(divName){
	this.context=createCanvas(divName);
	this.graphName="Graph Name";
	this.canvasWidth=800;
	this.canvasHeight = 700;
	this.xAxisLabelArr=["x1","x2","x3","x4"];
	this.yAxisLabelArr=["y1","y2","y3","y4"];
	this.backgroundColor="#E3F2FD";
}
Graph.prototype.drawBar=function(context,xpos,ypos,width,height){
//.../
//console.log("shit");
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




//child class of Graph
function BarGraph(divName){
	Graph.call(this,divName);
	this.barLengthsArr=[10,10,10,10,10,10,10];
	this.maxValue=100;//scaled to max 100
  	this.barMargin = 20;//distance between bars deafult value
  	this.colors = "blue";
}
// Object.setPrototypeOf(BarGraph.prototype,Graph.prototype);//doesnot work in safari 
BarGraph.prototype=Object.create(Graph.prototype); //works everywhere
BarGraph.prototype.constructor=BarGraph;

BarGraph.prototype.animateBarGraph=function(newArr){
	var animationSteps;
	//.....
}

BarGraph.prototype.update=function(newArr){	
    if(newArr.length===this.barLengthsArr){
    	this.animateBarGraph(newArr)();
    }
	this.barLengthsArr=newArr;
	this.draw();
}

BarGraph.prototype.draw=function(){
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

function CompareBarGraph(divName){
	BarGraph.call(this,divName);
	this.secondBarLengthArr=["10,10,10,10,10,10,10"];
	this.secondBarColor="violet";
}
CompareBarGraph.prototype=Object.create(BarGraph.prototype); //works everywhere
CompareBarGraph.prototype.constructor=CompareBarGraph;

CompareBarGraph.prototype.update=function(newArr1,newArr2){	
    
	this.barLengthsArr=newArr1;
	console.log("shit")
	this.secondBarLengthArr=newArr2;
	this.doubleDraw();
}
CompareBarGraph.prototype.doubleDraw=function(){
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
	 	this.border=3;
	 	//adding only if it is visible
	if (scaledBarHeight > this.border * 2) {
	// apply gradient colors to 
		this.gradientForBar(ratio,xcord,ycord,scaledBarHeight,"white","red");
		this.gradientForBar(ratio,xcord2,ycord2,scaledBarHeight2,"white","red");


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


function renderGraphs(){
	var bgraph= new BarGraph("BarGraph1");
	bgraph.xAxisLabelArr=["Mon", "Tue", "Wed", "Thu","Fri","Sat","Sun"];
	bgraph.update([10,20,30,40,50,60,70]);

	setInterval(function(){
		bgraph.update([100*Math.random(),100*Math.random(),100*Math.random(),100*Math.random(),100*Math.random(),])
	},2000)

	var bgraph2=new CompareBarGraph("BarGraph2");
	bgraph2.xAxisLabelArr=["Mon", "Tue", "Wed", "Thu","Fri","Sat","Sun"];
	bgraph2.update([10,20,30,40,50,60,70],[10,10,10,10,10,10,10]);

}
renderGraphs();



