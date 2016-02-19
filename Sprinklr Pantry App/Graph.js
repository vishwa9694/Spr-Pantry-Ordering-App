// Graph.prototype.setCanvasWidth=function(width){
// 		this.canvasWidth=width;
// 		console.log("setCanvasWidth ");
// 	}
// Graph.prototype.setCanvasHeight=function(height){
// 		this.canvasHeight=height;
// 		console.log("setCanvasWidth ");
// 	}
// Graph.prototype.setxAxisLabelArr=function(Arr){
// 		this.xAxisLabelArr=Arr;
// 		console.log("Set x-axis label");
// }
// Graph.prototype.setyAxisLabelArr=function(Arr){
// 		this.yAxisLabelArr=Arr;
// 		console.log("Set y-axis label");
// }
// Graph.prototype.setbackgroundcolor=function(color){
// 		this.backgroundColor=color;
// 		console.log("backgroundColor");
// }
//return canvas context 
var createCanvas=function (divName) {
			var div = document.getElementById(divName);
			var canvas = document.createElement('canvas');
			div.appendChild(canvas);
			var context = canvas.getContext("2d");
			return context;
		};

function Graph(context){
	this.context=context;
	this.graphName="Graph Name";
	this.canvasWidth=500;
	this.canvasHeight = 500;
	this.xAxisLabelArr=["x1","x2","x3","x4"];
	this.yAxisLabelArr=["y1","y2","y3","y4"];
	this.backgroundColor="#fff";
}
Graph.prototype.giveBar=function(context,xpos,ypos,width,height){
//.../
}
Graph.prototype.giveCircle=function(context,xpos,ypos,width,height){
//.../
}
Graph.prototype.controlShadow=function(context,OffsetX,OffsetY,Blur,Color){
	context.shadowOffsetX=OffsetX;
	context.shadowOffsetY=OffsetY;
	context.shadowBlur=Blur;
	context.shadowColor=Color;
			//return context;
}


//child class of Graph
function BarGraph(context){
	//  context=Object.create(BarGraph.prototype);
	//default values
	Graph.call(this,context);
	this.barLengthsArr=[10,10,10,10,10,10,10];
	this.maxValue=100;//scaled to max 100
  	this.barMargins = 20;//distance between bars deafult value
  	this.colors = "red";
	//return this
}
// Object.setPrototypeOf(BarGraph.prototype,Graph.prototype);//doesnot work in safari 
BarGraph.prototype=Object.create(Graph.prototype); //works everywhere
BarGraph.prototype.constructor=BarGraph;


BarGraph.prototype.update=function(newArr){	
	console.log("update");
	this.barLengthsArr=newArr;
	this.draw();
}
BarGraph.prototype.draw=function(){
	console.log("draw");
	 //Assign dimesnsions to canvas
	  this.context.canvas.width = this.canvasWidth;
	  this.context.canvas.height = this.canvasHeight;		
	  // Draw the background color
	  this.context.fillStyle = this.backgroundColor;
	  this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

	  // If x axis labels exist then make room	
	  if (this.xAxisLabelArr.length) {
		this.canvasHeight -= 40;
	  }
	  if (this.yAxisLabelArr.length) {
		this.canvasWidth -= 40;
	  }

	 var numOfBars=this.barLengthsArr.length;//number of bars
	 var barWidth =this.canvasWidth/(2*numOfBars );//bar width
	 this.barMargins=barWidth;//space between bars
	 var maxBarHeight=this.canvasHeight*4/5;//scaled to this.so largest bar will be maxBarheight
	 var largestValue = 0;
	 var arr=this.barLengthsArr;
	 largestValue=arr.reduce(function(x,y){
	  	return Math.max(x,y);
	  },arr[0]);
	 
	 var i,scale;
	 //Draw each bar separately
	 
	 for (i=0;i<arr.length;i+=1){
	 	scaledBarHeight=arr[i]/largestValue * maxBarHeight;
	 	this.context.fillStyle="red";
	 	this.context.fillRect(this.barMargins + i * this.canvasWidth / numOfBars,this.canvasHeight - scaledBarHeight,barWidth,scaledBarHeight);
	 }
}

function renderGraphs(){
	var context=createCanvas("BarGraph1");
	var bgraph= new BarGraph(context);
	//graph.margin 
	bgraph.xAxisLabelArr=["Mon", "Tue", "Wed", "Thu","Fri","Sat","Sun"];
	bgraph.update([10,20,30,40,50,60,70]);
}
renderGraphs();