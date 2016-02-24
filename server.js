//require('node_modules');
var http = require("http");
var fs = require("fs");
var path = require("path");
var orders = [
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
		
		];


var menu = [
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

					}
				]
			}
		];
var notifications = [];
http.createServer(function(req, res) {

	console.log(req.url);
	if (req.url === "/admin") {
		fs.readFile("./AdminPage/admin.html", "UTF-8", function(err, html) {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(html);
		});

	} else if (req.url === "/") {
		fs.readFile("./Homepage/index.html", "UTF-8", function(err, html) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });

	}

	else if (req.url === '/styles.css') {

		//var cssPath = path.join(__dirname, 'AdminPage', req.url);
		var fileStream = fs.createReadStream("./AdminPage/styles.css", "UTF-8");

		res.writeHead(200, {"Content-Type": "text/css"});

		fileStream.pipe(res);

	} 
	else if (req.url === '/style/style.css') {

		//var cssPath = path.join(__dirname, 'AdminPage', req.url);
		fs.readFile("./Homepage/style/style.css", "UTF-8", function(err, css) {
            res.writeHead(200, {"Content-Type": "text/css"});
            
                res.end(css);
                });

	} 
	else if(req.url === "/style/front_styles.css") {
		fs.readFile("./Homepage/style/front_styles.css", "UTF-8", function(err, css) {
            res.writeHead(200, {"Content-Type": "text/css"});
            res.end(css);
                });
	}
	else if (req.url === "/assets/defaultItem.png" || req.url === "/assets/spr-logo.png") {

		var imgPath = path.join(__dirname, 'AdminPage', req.url);
		var imgStream = fs.createReadStream(imgPath);

		res.writeHead(200, {"Content-Type": "image/jpeg"});

		imgStream.pipe(res);

	} else if (req.url==="/app.js") {

		var jsPath = path.join(__dirname, 'AdminPage', req.url);
		var fileStream = fs.createReadStream(jsPath, "UTF-8");

		res.writeHead(200, {"Content-Type": "text/js"});

		fileStream.pipe(res);
	} 
		else if (req.url==="/javascript/Item.js"||req.url==="/javascript/login.js" || req.url==="/javascript/main.js" || req.url === "/javascript/menuOrder.js" || req.url === "/javascript/notification.js" || req.url === "/javascript/Order.js"|| req.url === "/javascript/services.js") {
			console.log(req.url);
		var jsPath = path.join(__dirname, 'Homepage', req.url);
            //console.log(jsPath);
		var fileStream = fs.createReadStream(jsPath, "UTF-8");

		res.writeHead(200, {"Content-Type": "text/js"});

		fileStream.pipe(res);
	} 
	else if(req.url === '/orders') {
		res.writeHead(200, {"Content-Type": "text/json"});
	    res.end(JSON.stringify(orders));	
	} else if(req.url === '/menu') {
		res.writeHead(200, {"Content-Type": "text/json"});
	    res.end(JSON.stringify(menu));
	}
	else if(req.url === '/menuItem') {
		res.writeHead(200, {"Content-Type": "text/json"});
	    res.end(JSON.stringify(menu));
	}
	 else if(req.url === '/addItemInMenu') {
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
			var notification = {
				uid: filteredOrders[0].uid,
				read: false,
				item: filteredOrders[0].itemName,
				status: orderData.ntStatus,
				reason: orderData.reason
			};
			notifications.push(notification);
			notifications.forEach(function(notification){
				console.log(notification.status);
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
	else if(req.url === '/yoyo') {
		var order="";
        console.log("Yello");
        if (req.method == 'POST') {
           // console.log("[200] " + req.method + " to " + req.url);

            req.on('data', function(chunk) {
                //console.log("Received body data:");
               // console.log(chunk.toString());
                order+=chunk;
            });

            req.on('end', function() {

                    order=JSON.parse(order);

                    var pno=orders[orders.length-1].orderNo;

                    order.forEach(function (item,i,order){

                        prev=orders.length-1;
                        item.orderId=orders[prev].orderId+1;
                        item.orderNo=pno;
                        item.status="Queued";
                        orders.push(item);
                        console.log(item);

                    });
                console.log(orders);
                res.writeHead(200, "OK", {'Content-Type': 'text/html'});

                res.end();
            });
        }
	}
	else if(req.url==="/delorder")
		{
			var order="";
        if (req.method == 'POST') {

            req.on('data', function(chunk) {
                order+=chunk;
            });

            req.on('end', function() {
            		console.log(order);
            		order=JSON.parse(order);
            		order.del=parseInt(order.del);
            		orders.forEach(function(item){
            			console.log(item.orderId);
            			if(order.del===item.orderId)
            			{
            				item.status="Cancelled";
            				console.log(item);
            			}
            		})
             
                    });
            	console.log(orders);
                res.writeHead(200, "OK", {'Content-Type': 'text/html'});

                res.end();
            };
        }
	else if(req.url==="/getNotifications") {			
			var user = "";		
			req.on('data', function(chunk) {		
                //console.log("Received body data:");		
               // console.log(chunk.toString());		
                user+=chunk;		
            });		
            req.on("end", function() {		
            	console.log(user);		
            	user = JSON.parse(user);		
            	var filter=notifications.filter(function(notification) {		
            		return (notification.uid === user.userId && notification.read === false);		
            	});		
            	filter.forEach(function(notification) {		
            		console.log(notification.item);		
            	});		
            	console.log()		
            	res.writeHead(200, "OK", {'Content-Type': 'text/json'});		
                res.end(JSON.stringify(filter));		
            });		
		}
	
		
		else
		{
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.end("404 File Not Found");
	}

}).listen(3000);


console.log("File server running on port 3000");
// var a = menu.find(function(category){
// 	return category;
// });