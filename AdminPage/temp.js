http=require('http');
var fs = require('fs');
var qs = require('querystring');

var htmlFile;
var cssFile;
var menu = [
    {
        category: "Bevarages",
        categoryItems:
            [
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
        categoryItems:
            [
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
var orders=
[{
    "uid":"12316t2138172",
"orderId":1,
    "orderNo":1,
    "orderName": "Vishwa",
    "table": 9,
    "itemName": "Cornflakes",
    "quantity": 1,
    "itemDescription": "cold",
    "status": "InQueue"
},
    {
        "uid":"12316t2138172",
        "orderId":1,
        "orderNo":1,
        "orderName": "Vishwa",
        "table": 9,
        "itemName": "Cornflakes",
        "quantity": 1,
        "itemDescription": "cold",
        "status": "InQueue"
    },
    {
        "uid":"12316t2138172",
        "orderId":1,
        "orderNo":1,
        "orderName": "Vishwa",
        "table": 9,
        "itemName": "Cornflakes",
        "quantity": 1,
        "itemDescription": "cold",
        "status": "InQueue"
    },
    {
        "uid":"12316t2138172",
        "orderId":1,
        "orderNo":1,
        "orderName": "Vishwa",
        "table": 9,
        "itemName": "Cornflakes",
        "quantity": 1,
        "itemDescription": "cold",
        "status": "InQueue"
    },
    {
        "uid":"12316t2138172",
        "orderId":1,
        "orderNo":1,
        "orderName": "Vishwa",
        "table": 9,
        "itemName": "Cornflakes",
        "quantity": 1,
        "itemDescription": "cold",
        "status": "InQueue"
    },
    {
        "uid":"12316t2138172",
        "orderId":1,
        "orderNo":1,
        "orderName": "Vishwa",
        "table": 9,
        "itemName": "Cornflakes",
        "quantity": 1,
        "itemDescription": "cold",
        "status": "InQueue"
    }]

var server=http.createServer(function(req,res){
    switch(req.url)
    {
    
        case "/":   fs.readFile("./index.html", "UTF-8", function(err, html) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
                });
        break;
            case "/style.css": fs.readFile("./style.css", "UTF-8", function(err, css) {
            res.writeHead(200, {"Content-Type": "text/css"});
            
                res.end(css);
                });
        break;
            
            case "/front_styles.css": fs.readFile("./front_styles.css", "UTF-8", function(err, css) {
            res.writeHead(200, {"Content-Type": "text/css"});
            res.end(css);
                });
        break;
                
        case "/login.js": fs.readFile("./login.js", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/javascript"});

            res.end(js);
                });
        break;
                case "/items_tiles.js": fs.readFile("./items_tiles.js", "UTF-8", function(err, js) {
            
                res.writeHead(200, {"Content-Type": "text/javascript"});
                    res.end(js);
                });
        break;


        case "/mvo/controller.js": fs.readFile("./mvo/controller.js", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/javascript"});

            res.end(js);
        });
            break;
        case "/mvo/view.js": fs.readFile("./mvo/view.js", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/javascript"});

            res.end(js);
        });
            break;

        case "/mvo/model.js": fs.readFile("./mvo/model.js", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/"});

            res.end(js);
        });
            break;
        case "/menuItem": //fs.readFile("./item", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            js=JSON.stringify(menu);

            res.end(js);
            console.log("Sent");

            break;
        case "/orders": //fs.readFile("./item", "UTF-8", function(err, js) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            js=JSON.stringify(orders);

            res.end(js);
            console.log("Sent");

            break;

        case "/assets/defaultItem.png":
            var imgPath = "."+req.url;
            var imgStream = fs.createReadStream(imgPath);
            res.writeHead(200, {"Content-Type": "image/png"});
            imgStream.pipe(res);

            break;

        case "/yoyo":
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
                            item.status="InQueue";
                            orders.push(item);
                            console.log(item);

                        });
                    console.log(orders);
                    res.writeHead(200, "OK", {'Content-Type': 'text/html'});

                    res.end();
                });
              }
            /*
            console.log("YOYO!");
            //console.log(req.on);
            var body = '';

            req.on('data', function (data) {
                body += data;

                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on('end', function () {
                var post = qs.parse(body);
                console.log(body);
                console.log(post);
            });

            console.log(body);
            */break;

        default:
            console.log("request missed of");
            console.log(req.url);
            res.end();
            break;
    };
    
   });
server.listen(3000);
console.log("Server is running");