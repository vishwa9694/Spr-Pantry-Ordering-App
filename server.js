//require('node_modules');
var http = require("http");
var fs = require("fs");
var path = require("path");
var orders = [
		{
			orderId:1,
			orderNo:1,
			orderName: "Vishwa",
			table: 9,
			itemName: "Cornflakes",
			quantity: 1,
			itemDescription: "cold",
			status: "InQueue",
		},
		{
			orderId:2,
			orderNo:1,
			orderName: "Vishwa",
			table: 9,
			itemName: "Chocos",
			quantity: 1,
			itemDescription: "cold",
			status: "InQueue",
		},
		{
			orderId:3,
			orderNo:2,
			orderName: "Anup",
			table: 9,
			itemName: "Maggi",
			quantity: 1,
			itemDescription: "-",
			status: "InQueue",
		},
		{
			orderId:4,
			orderNo:2,
			orderName: "Anup",
			table: 9,
			itemName: "Tea",
			quantity: 1,
			itemDescription: "cold",
			status: "InQueue",
		},
		{
			orderId:5,
			orderNo:3,
			orderName: "Akshat",
			table: 9,
			itemName: "Cornflakes",
			quantity: 1,
			itemDescription: "cold",
			status: "InQueue",
		},
		{
			orderId:6,
			orderNo:3,
			orderName: "Akshat",
			table: 9,
			itemName: "Chocos",
			quantity: 1,
			itemDescription: "cold",
			status: "InQueue",
		},
		
		];


var menu = [
			{
				category: "Bevarages",
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
		];
http.createServer(function(req, res) {

	//console.log(${req.method} request for ${req.url});

	if (req.url === "/admin") {
		fs.readFile("./AdminPage/admin.html", "UTF-8", function(err, html) {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(html);
		});

	} else if (req.url.match(/.css$/)) {

		var cssPath = path.join(__dirname, 'AdminPage', req.url);
		var fileStream = fs.createReadStream(cssPath, "UTF-8");

		res.writeHead(200, {"Content-Type": "text/css"});

		fileStream.pipe(res);

	} else if (req.url.match(/.png$/)) {

		var imgPath = path.join(__dirname, 'AdminPage', req.url);
		var imgStream = fs.createReadStream(imgPath);

		res.writeHead(200, {"Content-Type": "image/jpeg"});

		imgStream.pipe(res);

	} else if (req.url.match(/.js$/)) {

		var jsPath = path.join(__dirname, 'AdminPage', req.url);
		var fileStream = fs.createReadStream(jsPath, "UTF-8");

		res.writeHead(200, {"Content-Type": "text/js"});

		fileStream.pipe(res);
	} else if(req.url === '/orders') {
		res.writeHead(200, {"Content-Type": "text/json"});
	    res.end(JSON.stringify(orders));	
	} else if(req.url === '/menu') {
		res.writeHead(200, {"Content-Type": "text/json"});
	    res.end(JSON.stringify(menu));
	} else if(req.url === '/addItemInMenu') {
		var body = "";
		req.on('data',function(data) {
			body += data;
		});
		req.on('end', function() {
			var itemDetails = JSON.parse(body);
			for(var iterator = 0; iterator < menu.length; iterator++) {
				if(menu[iterator].category === itemDetails.categoryName) {
					var selectedCategory = menu[iterator];
					break;
				}
			}
			if(selectedCategory) {
				var item = {itemName: itemDetails.itemName, available: true, imgSrc: itemDetails.itemImg};
				selectedCategory.categoryItems.push(item);
			} else {
				var menuCategory = {category: itemDetails.categoryName, categoryItems:[{itemName: itemDetails.itemName, available: true, imgSrc: itemDetails.itemImg}]};
				menu.push(menuCategory);
			}
			// menu.forEach(function(category) {
			// 	console.log(category.category);
			// });
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("Menu Updated.");
		});

	}
	else if(req.url === '/changeOrderStatus') {
		var body = "";
		req.on('data',function(data) {
			body += data;
		});
		req.on('end', function() {
			var orderData = JSON.parse(body);
			filteredOrders = orders.filter(function(order) {
				return (order.orderId === orderData.orderId);
			});
			filteredOrders[0].status = orderData.status;
			orders.forEach(function(order){
				console.log(order.orderId, order.status);
			});
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("Order Updated.");
		});
	}
	else if(req.url === '/changeItemStatus') {
		var body = "";
		req.on('data',function(data) {
			body += data;
		});
		req.on('end', function() {
			var itemData = JSON.parse(body);
			console.log(itemData.status);
			filteredCategory = menu.filter(function(category) {
				return (category.category === itemData.category);
			});
			var item = filteredCategory[0].categoryItems.filter(function(item){
				return (item.itemName === itemData.item);
			});
			item[0].available = itemData.status;
			menu.forEach(function(category){
				category.categoryItems.forEach(function(item){
					console.log(item.itemName, item.available);	
				});
				
			});
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("Item Updated.");
		});
	}
	else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("404 File Not Found");
	}

}).listen(3000);


console.log("File server running on port 3000");
// var a = menu.find(function(category){
// 	return category;
// });