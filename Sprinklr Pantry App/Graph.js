
function BarGraph(ctx) {
  var that = this;				
  // Draw method updates the canvas with the current display 

  //filled with default values
  this.width = 500;
  this.height = 500;	
  this.maxValue=100;
  this.margin = 30;
  this.colors = ["purple", "red", "green", "yellow"];
  this.curArr = [1,1,1,1];
  this.backgroundColor = "#fff";
  this.xAxisLabelArr = [];
  this.yAxisLabelArr = [];	
  // Update method redraws the entire graph
  this.update = function (newArr) {
	that.curArr = newArr;
	draw(newArr); 
	}; 
  var draw = function (arr) {
							
	  var numOfBars = arr.length;
	  var barWidth;
	  var barHeight;
	  var border = 1;
	  var ratio;
	  var maxBarHeight;
	  var gradient;
	  var largestValue;
	  var graphAreaX = 0;
	  var graphAreaY = 0;
	  var graphAreaWidth = that.width;
	  var graphAreaHeight = that.height;
	  var i;
	  
		// Update the dimensions of the canvas only if they have changed
	  if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
		  ctx.canvas.width = that.width;
		  ctx.canvas.height = that.height;
	  }
				
	  // Draw the background color
	  ctx.fillStyle = that.backgroundColor;
	  ctx.fillRect(0, 0, that.width, that.height);
					
	  // If x axis labels exist then make room	
	  if (that.xAxisLabelArr.length) {
		graphAreaHeight -= 40;
	  }
				
	  // Calculate dimensions of the bar
	  barWidth = graphAreaWidth / numOfBars - that.margin * 2;
	  maxBarHeight = graphAreaHeight - 25;
				
	  // Determine the largest value in the bar array
	  var largestValue = 0;
	  largestValue=arr.reduce(function(x,y){
	  	return Math.max(x,y);
	  },arr[0]);
	  
	  // For each bar
	  for (i = 0; i < arr.length; i += 1) {
			// Set the ratio of current bar compared to the maximum
			if (that.maxValue) {
			  ratio = arr[i] / that.maxValue;
			} else {
			  ratio = arr[i] / largestValue;
			}
			
			barHeight = ratio * maxBarHeight;
		  
			// Turn on shadow
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 2;
			ctx.shadowBlur = 2;
			ctx.shadowColor = "#999";			
			// Draw bar background
			ctx.fillStyle = "#333";			
			ctx.fillRect(that.margin + i * that.width / numOfBars,
			  graphAreaHeight - barHeight,
			  barWidth,
			  barHeight);
				
			// Turn off shadow
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
			// Draw bar color if it is large enough to be visible
			if (barHeight > border * 2) {
				// Create gradient
				gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
				gradient.addColorStop(1-ratio, that.colors[i % that.colors.length]);
				gradient.addColorStop(1, "#ffffff");
				ctx.fillStyle = gradient;
				// Fill rectangle with gradient
				ctx.fillRect(that.margin + i * that.width / numOfBars + border,
				  graphAreaHeight - barHeight + border,
				  barWidth - border * 2,
				  barHeight - border * 2);
			}
			// Write bar value
			ctx.fillStyle = "#333";
			ctx.font = "bold 12px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(parseInt(arr[i],10),
				i * that.width / numOfBars + (that.width / numOfBars) / 2,
				graphAreaHeight - barHeight - 10);	
			// Draw bar label if it exists
			if (that.xAxisLabelArr[i]) {					
			  ctx.fillStyle = "#333";
			  ctx.font = "bold 12px sans-serif";
			  ctx.textAlign = "center";
			  ctx.fillText(that.xAxisLabelArr[i],
				  i * that.width / numOfBars + (that.width / numOfBars) / 2,
				  that.height - 10);	
			  };
		};
	  };	
};


var renderGraphs=function () {
		function createCanvas(divName) {
			var div = document.getElementById(divName);
			var canvas = document.createElement('canvas');
			div.appendChild(canvas);
			var ctx = canvas.getContext("2d");
			return ctx;
		};
		var ctx = createCanvas("BarGraph1");
		var graph = new BarGraph(ctx);
		graph.maxValue = 100;
		graph.margin = 20;
		graph.xAxisLabelArr = ["Mon", "Tue", "Wed", "Thu"];
		graph.yAxisLabelArr=[10,20]
		graph.update([Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]);
	};

renderGraphs();
