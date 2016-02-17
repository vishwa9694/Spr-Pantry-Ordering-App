var inputCount = 1;
var addBtn = document.getElementById("addInput");
var removeBtn = document.getElementById("removeInput");
var subCategories = document.getElementById("subCategories");
addBtn.onclick = function () {
	var newInput = document.createElement("input");
	newInput.setAttribute("class","md__input box-border");
	newInput.setAttribute("placeholder","Enter SubCategory Name");
	subCategories.appendChild(newInput);
	inputCount++;
}

removeBtn.onclick = function () {
	if(inputCount > 1) {
		subCategories.removeChild(subCategories.lastChild);
		inputCount--;
	}
	
}