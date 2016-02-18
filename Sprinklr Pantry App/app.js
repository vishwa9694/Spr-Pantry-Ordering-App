// var inputCount = 1;
// var addBtn = document.getElementById("addInput");
// var removeBtn = document.getElementById("removeInput");
// var subCategories = document.getElementById("subCategories");
// addBtn.onclick = function () {
// 	var newInput = document.createElement("input");
// 	newInput.setAttribute("class","md__input box-border");
// 	newInput.setAttribute("placeholder","Enter SubCategory Name");
// 	subCategories.appendChild(newInput);
// 	inputCount++;
// }

// removeBtn.onclick = function () {
// 	if(inputCount > 1) {
// 		subCategories.removeChild(subCategories.lastChild);
// 		inputCount--;
// 	}
	
// }
var bodyElement = document.getElementById("body");
var menuElement = document.getElementById("c-menu--slide-left");
var maskElement = document.getElementById("c-mask");
var buttonElement = document.getElementById("c-button--slide-left");
var cancelElement = document.getElementById("cancelButton");
function open(){
	bodyElement.classList.add('has-active-menu');
	menuElement.classList.add('is-active');
	maskElement.classList.add('is-active');
}

function close(){
	bodyElement.classList.remove('has-active-menu');
	menuElement.classList.remove('is-active');
	maskElement.classList.remove('is-active');
}

buttonElement.addEventListener('click', open, false);
maskElement.addEventListener('click', close, false);
cancelElement.addEventListener('click', close, false);
