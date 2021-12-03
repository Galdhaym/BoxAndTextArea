const $btn = document.querySelector(".add-btn");
const $area = document.querySelector(".area");

const areaWidth = $area.offsetWidth;
const areaHeight = $area.offsetHeight;

const boxWidth = 200;
const boxHeight = 200;

let boxes = [];
let action = false;
let $selectedBox = null;
let selectedBoxIndex = null;

let startCoords = {
	x: 0,
	y: 0
};
let currentCoords = {
	x: 0,
	y: 0
};
let distance = {
	x: 0,
	y: 0
};

if (!!localStorage.getItem("coords")) {
	boxes = JSON.parse(localStorage.getItem("coords"));
	renderBoxes(boxes);
}

function addInputValueToLocalStorage(e) {
	let index = e.target.parentElement.getAttribute("data-index");
	boxes[index].text = e.target.value;
	localStorage.setItem("coords", JSON.stringify(boxes));
}

function renderBoxes(boxes) {
	let template = "";
	for (let i = 0; i < boxes.length; i++) {
		template +=
			'<div class="box" data-index="' +
			i +
			'" style="transform: translate(' +
			boxes[i].x +
			"px, " +
			boxes[i].y +
			'px)"><input type="text" value=' +
			boxes[i].text +
			"></div>";
	}
	$area.innerHTML = template;
	var boxElements = $area.querySelectorAll(".box");
	var i = 0;
	for (let boxElement of boxElements) {
		var input = boxElement.getElementsByTagName("input")[0];
		input.addEventListener("input", addInputValueToLocalStorage);
		i++;
	}
}

function addNewBox(list) {
	let lastIndex = list.length - 1;
	let template =
		'<div class="box" data-index="' +
		lastIndex +
		'" style="transform: translate(' +
		list[lastIndex].x +
		"px, " +
		list[lastIndex].y +
		'px)"><input type="text"></div>';
	let boxElement = document.createElement("div");
	boxElement.innerHTML = template;
	var input = boxElement.getElementsByTagName("input")[0];
	input.addEventListener("input", addInputValueToLocalStorage);
	$area.appendChild(boxElement);
}

function boxController(coords) {
	$selectedBox.style.cssText = "transform: translate(" + coords.x + "px, " + coords.y + "px)";
}

$area.addEventListener("mousedown", function (e) {
	var maybeBox = e.target.closest(".box");

	if (maybeBox != undefined && !!maybeBox.classList.contains("box")) {
		$selectedBox = maybeBox;
		selectedBoxIndex = parseFloat($selectedBox.getAttribute("data-index"));

		if (e.target == maybeBox) {
			action = true;
			startCoords.x = e.clientX;
			startCoords.y = e.clientY;
		}
	}
});

$area.addEventListener("mouseup", function (e) {
	if (e.target.classList.contains("box")) {
		action = false;
		boxes[selectedBoxIndex].x = distance.x;
		boxes[selectedBoxIndex].y = distance.y;
		localStorage.setItem("coords", JSON.stringify(boxes));
	}
});

$area.addEventListener("mousemove", function (e) {
	if (action) {
		currentCoords.x = e.clientX;
		currentCoords.y = e.clientY;

		distance.x = boxes[selectedBoxIndex].x + (currentCoords.x - startCoords.x);
		distance.y = boxes[selectedBoxIndex].y + (currentCoords.y - startCoords.y);

		if (distance.x >= areaWidth - boxWidth) distance.x = areaWidth - boxWidth;
		if (distance.x <= 0) distance.x = 0;

		if (distance.y >= areaHeight - boxHeight) distance.y = areaHeight - boxHeight;
		if (distance.y <= 0) distance.y = 0;

		boxController(distance);
	}
});

$btn.addEventListener("click", function () {
	var newBox = { x: 0, y: 0, text: "" };
	boxes.push(newBox);

	addNewBox(boxes);
});
