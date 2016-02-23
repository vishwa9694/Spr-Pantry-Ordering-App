var orders =(function() {
	var xhttp = new XMLHttpRequest();
//		console.log("Hello");
	//xhttp.onreadystatechange = function() {
	xhttp.open("GET", "http://localhost:3000/orders", false);
	xhttp.send();
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		console.log(xhttp.responseText);
		return JSON.parse(xhttp.responseText);

	}
	//};

})();

var items =(function() {
		var xhttp = new XMLHttpRequest();
//		console.log("Hello");
		//xhttp.onreadystatechange = function() {
			xhttp.open("GET", "http://localhost:3000/menuItem", false);
			xhttp.send();
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(xhttp.responseText);
				 	 return JSON.parse(xhttp.responseText);

			}
		//};

})();
//console.log("hoho");
//console.log(items);
/* [{
	cname: "Cereals",
	citems: [{
		iname: "Cornflakes",
		img: "https://media.licdn.com/mpr/mpr/p/6/005/074/33e/3952002.jpg",
		available: true
	},
	{
		iname: "Chocos",
		img: "http://favim.com/orig/201107/12/bowl-brown-cereal-choco-flakes-chocolate-food-Favim.com-103328.jpg",
		available: true
	},
	{
		iname: "Muesli",
		img: "http://smackagency.com/wp-content/uploads/2014/07/muesli.jpeg",
		available: true
	}]
},
{
	cname: "Eggs",
	citems: [{
		iname: "Eggs",
		img: "http://img.sndimg.com/food/image/upload/w_555,h_416,c_fit,fl_progressive,q_95/v1/img/recipes/61/85/6/o1JQgDK7R70fdgv2ChFA_baked%20eggs.JPG",
		available: true
	},
	{
		iname: "Omlete",
		img: "http://paleoaholic.com/wp-content/uploads/2013/07/ommlette.jpg",
		available: true
	}]
},
{
	cname: "Beverages",
	citems: [{
		iname: "Green Tea",
		img: "http://princegladyexports.com/wp-content/uploads/2015/12/tea-08.jpg",
		available: true
	},
	{
		iname: "Tea",
		img: "http://i1.mirror.co.uk/incoming/article2579962.ece/ALTERNATES/s615/Tea-and-Biscuits.jpg",
		available: true
	},
	{
		iname: "Bournvita",
		img: "http://1.bp.blogspot.com/_E-KyFEBON7g/SITdxzSDVgI/AAAAAAAAAJo/554faT9jyX0/s400/bournvita.gif",
		available: true
	}]


}]*/;

var notifications = [{
	uid: "113352049485747139246",
	read: false,
	item: "Coffee",
	status: "Done",
	reason: null
},
	{
		uid: "113352049485747139246",
		read: false,
		item: "Tea",
		status: "InProgress",
		reason: null
	},
	{
		uid: "113352049485747139246",
		read: false,
		item: "Maggi",
		status: "Cancelled",
		reason: "Busy"
	},
	{
		uid: "113352049485747139246",
		read: false,
		item: "Eggs",
		status: "Cancelled",
		reason: "Item not found"
	}
];
