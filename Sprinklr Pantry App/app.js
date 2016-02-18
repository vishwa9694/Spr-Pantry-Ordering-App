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

var orderCancel = document.getElementById("cancelBtn");
function viewCancelDialog() {
	document.getElementById("reasonDialog").style.opacity = 1;
	document.getElementById("reasonDialog").style.pointerEvents = "auto";
}

orderCancel.addEventListener('click', viewCancelDialog, false);

function closeCancelDialog() {
	document.getElementById("reasonDialog").style.opacity = 0;
	document.getElementById("reasonDialog").style.pointerEvents = "none";
}

document.getElementById("closeReason").addEventListener('click',closeCancelDialog, false);

var openAddNewItemDialog = document.getElementById("openAddItemModal");
function viewNewItemDialog() {
	document.getElementById("AddItemModal").style.opacity = 1;
	document.getElementById("AddItemModal").style.pointerEvents = "auto";
}

openAddNewItemDialog.addEventListener('click', viewNewItemDialog, false);
function closeAddNewItemDialog() {
	document.getElementById("AddItemModal").style.opacity = 0;
	document.getElementById("AddItemModal").style.pointerEvents = "none";
}

document.getElementById("closeNewItemDialog").addEventListener('click',closeAddNewItemDialog, false);
