const cardComputer = document.getElementById("machine");
const cardUser = document.getElementById("user");
//cards containers
const viewComputer = document.querySelector("[data-player='computer']");
const viewUser = document.querySelector("[data-player='user']");
//end containers
const deckWrapperUser = document.querySelector(".user-deck");
const deckWrapperComputer = document.querySelector(".computer-deck");
const listDeckUser = deckWrapperUser.querySelector("ul");
const listDeckComputer = deckWrapperComputer.querySelector("ul");
const templateItem = document.getElementById("template-deck");

const displayPointsUser = document.getElementById("pt-user");
const displayPointsComputer = document.getElementById("pt-computer");
const computerAttributes = document.querySelectorAll("[data-attr=computer]");
const userAttributes = document.querySelectorAll("[data-attr=user]");
const iptRadios = document.getElementsByName("rad-attr");
const dialogRes = document.getElementById("dialogWinLose");
const dialogContent = document.querySelector(".dialog__content");
const dialogResBackdrop = document.querySelector(".backdrop");
const dialogButtons = document.querySelector(".dialog__button");
const dialogRestartButton = document.getElementById("dialog-tryagain");
const restartBtn = document.getElementById("btn-restart"); 
const playBtn = document.getElementById("btn-play");
const shuffleBtn = document.getElementById("btn-shuffle");
const imgUser = document.getElementById("img-user");
const imgComputer = document.getElementById("img-computer");
const userCardName = document.getElementById("user-card-name");
const computerCardName = document.getElementById("computer-card-name");
let pointsUser = 0; //User pontuation
let pointsComputer = 0; //Computer pontuation
let user, computer; //get player cards
let userDeck = [],
	computerDeck = []; // cards arrays

hideButton(dialogButtons);

//BUTTONS SECTIONS
const enableElement = (e) => e.removeAttribute("disabled");
const disableElement = (e) => e.setAttribute("disabled", "true");

playBtn.onclick = () => {
	if (isAttributeSelected()) {
		hideNotChoosedAttribute(getAttributeSelected());
		//shows the computer card
		rotateCard(cardComputer, viewComputer, 180);
		isLegendary(computer, cardComputer);
		disableElement(playBtn); //disable the play btn to prevent some problems...
		setTimeout(function () {
			//calls the function to validate who has the greater attribute
			checkVictory(user, computer);
		}, 1500);
		return;
	}
};

restartBtn.onclick = () =>{
	!(pointsUser == 0 && pointsComputer == 0) ? restartGame() : null;
}

//call the getCard function to get a randomly card to user and computer
//list the attributes on the cards and show the user card.
shuffleBtn.onclick = () => {
	user = getCard(userDeck);
	computer = getCard(computerDeck);
	listAttrs(user, computer);
	resetDataChooseAttribute();
	rotateCard(cardUser, viewUser, 180);
	
	isLegendary(user, cardUser);
	setTimeout(function () {
		disableElement(shuffleBtn);
		enableElement(playBtn);
	}, 200);
};
//Try again button, restart the game.
dialogRestartButton.onclick = () => {
	restartGame();
	hideButton(dialogButtons);
};


//LOGIC SECTION

function restartGame(){
	resetState(); 
	resetPoints(); 
	isAttributeSelected() ? clearRadios() : null;
	try {
		createDeck(); //shuffle the main array again
	} catch (error) {
		console.error(error);
	}
	listCardsRemain();
}

//Show remaining cards for both players
function listCardsRemain() {
	let deckVisual = templateItem.content.cloneNode(true);
	let itemsUser = listDeckUser.querySelectorAll(".card-item");
	let itemsComputer = listDeckComputer.querySelectorAll(".card-item");
  const cardsRemainsComputer = document.querySelector("[data-remains-cards='computer']");
  const cardsRemainsUser = document.querySelector("[data-remains-cards='user']");
	itemsUser.forEach((item) => {
		item.remove();
	});
	itemsComputer.forEach((item) => {
		item.remove();
	});
	showListDecks(deckVisual, listDeckUser, userDeck.length);
	showListDecks(deckVisual, listDeckComputer, computerDeck.length);
	cardsRemainsComputer.textContent = computerDeck.length;
	cardsRemainsUser.textContent = userDeck.length;
}

function showListDecks(template, target, deckSize) {
	for (let i = 0; i < deckSize; i++) {
		const cards = template.querySelector(".card-item").cloneNode(true);
		target.appendChild(cards);
	}
}

//check if the card is a legendary
function isLegendary(player, cardElement) {
	if (player.hasOwnProperty("legend")) {
		cardElement.classList.add("legendary-card");
		return;
	}
}
//remove thr animation classes
function turnOffLegendary() {
	cardUser.classList.remove("legendary-card");
	cardComputer.classList.remove("legendary-card");
}
//reset all the points
function resetPoints() {
	pointsUser = 0;
	pointsComputer = 0;
	displayPointsUser.textContent = pointsUser;
	displayPointsComputer.textContent = pointsComputer;
}
//hide cards, close the dialog if open
function resetState() {
	closeDialog();
	turnOffLegendary();
	rotateCard(cardUser, viewUser, 0);
	rotateCard(cardComputer, viewComputer, 0);
	enableElement(shuffleBtn);
	disableElement(playBtn);
}

function hideButton(e) {
	e.classList.toggle("hide-button");
}

//function to get randomly card
function getCard(deck) {
	//receives a deck array
	if (!checkDeckSize(deck)) {
		let rNum = Math.floor(Math.random() * deck.length);
		return deck[rNum];
	}
}

/*
change the data-content-type value attribute to
stylize the dialog based on the type (lose, win, tie). */
function handleDialogContentType(title){
	const CONTENT_TYPES = {
		win: "win",
		lose: "lose",
		tie: "tie",
		defeat: "lose",
		winner: "win"
	}
	dialogContent.dataset.contentType = CONTENT_TYPES[title];
}
//toggle on the visibility of the restart button in dialog if has a winner or defeated
function handleDialogButtonState(title){
	if(title === "defeat" || title === "winner"){
		hideButton(dialogButtons);
	}
}

//show the dialog with the specified message and behavior
function showDialog(title) {
	let dlTitle = document.getElementById("dialog-title");
	handleDialogContentType(title);
	handleDialogButtonState(title);

	dlTitle.textContent = handleDialogContent(title);
	dialogRes.show(); //show up the dialog with no-modal type
	dialogResBackdrop.classList.toggle("backdrop--visible");
	
	//close the dialog after 1500ms if was not a winner
	if (title !== "defeat" && title !== "winner") {
		dialogRes.classList.add("animate-dialog");
		setTimeout(() => {
			resetState();
			dialogRes.classList.remove("animate-dialog");
		}, 1500);
	}
}
function closeDialog() {
	if(dialogRes.open){
		dialogRes.close();
		dialogResBackdrop.classList.toggle("backdrop--visible");
	}
}
/*
function to get the titles parameter for dialog
and return the correct phrase.
*/
function handleDialogContent(title) {
	let titles = {
		win: "Wow! You've won!",
		lose: "Sorry, you lost.",
		tie: "It's a tie!",
		defeat: "You've been defeated...",
		winner: "Congratulations! You're the winner!"
	};
	return titles[title] || "No parameter found.";
}

//function to show the attributes list
//receives two Objects
function listAttrs(player, machine) {
	let [pcAttack, pcAgility, pcDefense] = computerAttributes;
	let [userAttack, userAgility, userDefense] = userAttributes;
	let [radioAttack, radioAgility, radioDefense] = iptRadios;
	[imgUser.src, imgComputer.src] = [player.image, machine.image];
	[userCardName.textContent, computerCardName.textContent] = [player.name, computer.name];
	[pcAttack.textContent, pcAgility.textContent, pcDefense.textContent] = [machine.attack, machine.agility, machine.defense];
	[userAttack.textContent, userAgility.textContent, userDefense.textContent] = [player.attack, player.agility, player.defense];
	[radioAttack.value, radioAgility.value, radioDefense.value] = ["attack", "agility", "defense"];
}

//function to check if user has won or lose
//receives two Objects
function checkVictory(cardUserObject, cardComputerObject) {
	//gets the value of the checked radiobutton
	let selectedAttr = getAttributeSelected();
	if (cardUserObject[selectedAttr] > cardComputerObject[selectedAttr]) {
		pointsUser++;
		removeCard(computer, computerDeck);
		//if the computer deck is empty, player wins and finish the play, if not, player wins the round
		checkDeckSize(computerDeck) ? showDialog("winner") : showDialog("win");
	} else if (cardUserObject[selectedAttr] < cardComputerObject[selectedAttr]) {
		pointsComputer++;
		removeCard(user, userDeck);
		//check if the userDeck is empty
		checkDeckSize(userDeck) ? showDialog("defeat") : showDialog("lose");
	} else {
		pointsUser++;
		pointsComputer++;
		showDialog("tie");
	}
	displayPointsUser.textContent = pointsUser;
	displayPointsComputer.textContent = pointsComputer;
	clearRadios();
	listCardsRemain();
	return;
}
//remove a card from the loser deck.
function removeCard(card, deck) {
	let index = -1; //save the card index
	for (let i = 0; i < deck.length; i++) {
		if (deck[i] === card) {
			index = i;
			break;
		}
	}
	//remove if the item is found
	index !== -1 ? deck.splice(index, 1) : null;
}
//check if a deck is empty.
//return true if the deck is empty.
//single line function by 1loc.dev
function checkDeckSize(deckTarget) {
	const deckIsEmpty = (arr) => Array.isArray(deckTarget) && !deckTarget.length;
	return deckIsEmpty(deckTarget);
}

//clear the radio checked
function clearRadios() {
	for (let radio of iptRadios) {
		radio.checked ? (radio.checked = false) : null;
	}
	return;
}

//function to get the user selected attribute and returns the selected option.
function getAttributeSelected() {
	let selected;
	for (let radio of iptRadios) {
		if (radio.checked === true) {
			selected = radio.value;
			break; //breaks the loop when a checked radio is found.
		}
	}
	return selected;
}
function isAttributeSelected() {
	return getAttributeSelected() != null ? true : false;
}

/* 
function to set date-choose attribute to "yes",
this will hide the computer attributes 
that is not the same selected by user  
*/
function hideNotChoosedAttribute(attr){
	const computerAttrEquivalent = document.querySelectorAll(".attr-computer");
	for(let item of computerAttrEquivalent){
		if(item.dataset.attributeName === attr){
			item.dataset.choose = "yes";
			break;
		}
	}
}
function resetDataChooseAttribute(){
	const computerAttrEquivalent = document.querySelectorAll(".attr-computer");
	for(let item of computerAttrEquivalent){
		if(item.dataset.choose === "yes"){
			item.dataset.choose = "no";
		}
	}
}

//function to rotate the cards
function rotateCard(card, viewCard, degrees) {
	degrees === 180 ? card.classList.add("rotate") : card.classList.remove("rotate");
	viewCard.classList.add("elevate");
	let inter = setInterval(function () {
		viewCard.classList.remove("elevate");
		clearInterval(inter);
	}, 800);
}

//Fisher-Yates shuffle algorithm
//return a new shuffled array
function shuffleCardArray(array) {
	let old, copy;
	copy = array.slice();
	for (let i = array.length - 1; i >= 0; i--) {
		let r_n = Math.floor(Math.random() * (i + 1));
		old = copy[i];
		[copy[i], copy[r_n]] = [copy[r_n], old];
	}
	return copy;
}

//call the shuffleCardArray function to get a copy of the main array and shuffle it.
//get the copied array and divide to user and computer decks.
function createDeck() {
	let shuffled = shuffleCardArray(objs);
	if (!(shuffled.length % 2 == 0)) {
		throw new Error("shuffled array is not even.");
	}
	let s = shuffled.length / 2;
	userDeck = shuffled.slice(0, s);
	computerDeck = shuffled.slice(s, shuffled.length);
	// console.log(`Created the deck: userDeck${JSON.stringify(userDeck, null, 5)} with size: ${userDeck.length}`);
	// console.log(`Created the deck: computerDeck${JSON.stringify(computerDeck, null, 5)} with size: ${computerDeck.length}`);
}
var objs = [
	{
		name: "Jill Valentine",
		image: "/assets/image/jill.webp",
		attack: 9,
		agility: 8.5,
		defense: 7
	},
	{
		name: "Ada Wong",
		image: "/assets/image/ada.webp",
		attack: 9,
		agility: 9,
		defense: 7.5
	},
	{
		name: "Claire Redfield",
		image: "/assets/image/claire_2.webp",
		attack: 7,
		agility: 8.5,
		defense: 6.5
	},
	{
		name: "Piers Nivans",
		image: "/assets/image/piers.webp",
		attack: 7,
		agility: 5,
		defense: 8
	},
	{
		name: "Rebecca Chambers",
		image: "/assets/image/rebecca_chambers.webp",
		attack: 6,
		agility: 9,
		defense: 6.5
	},
	{
		legend: true,
		name: "Chris Redfield",
		image: "/assets/image/chris.webp",
		attack: 9.5,
		agility: 5.5,
		defense: 7.5
	},
	{
		name: "Ethan Winters",
		image: "/assets/image/ethan.webp",
		attack: 6,
		agility: 7,
		defense: 8
	},
	{
		name: "Vector",
		image: "/assets/image/vector.webp",
		attack: 7.5,
		agility: 8,
		defense: 5
	},
	{
		name: "Hunk",
		image: "/assets/image/hunk.webp",
		attack: 8,
		agility: 8.5,
		defense: 7.5
	},
	{
		name: "Helena Harper",
		image: "/assets/image/helena.webp",
		attack: 7,
		agility: 8,
		defense: 7
	},
	{
		name: "Leon S. Kennedy",
		image: "/assets/image/leon.webp",
		attack: 8,
		agility: 9,
		defense: 7.5
	},
	{
		name: "Luiz Serra",
		image: "/assets/image/luiz.webp",
		attack: 5.5,
		agility: 7,
		defense: 7.5
	},
	{
		name: "Carlos Oliveira",
		image: "/assets/image/carlos.webp",
		attack: 7,
		agility: 7,
		defense: 8
	},
	{
		name: "Barry Burton",
		image: "/assets/image/barry.webp",
		attack: 8,
		agility: 6,
		defense: 8
	},
	{
		name: "Bitorez",
		image: "/assets/image/bitorez.webp",
		attack: 9.5,
		agility: 5,
		defense: 8.5
	},
	{
		legend: true,
		name: "Albert Wesker",
		image: "/assets/image/wesker.webp",
		attack: 9,
		agility: 10,
		defense: 7.5
	},
	{
		name: "Krauser",
		image: "/assets/image/krauser.webp",
		attack: 6.5,
		agility: 8,
		defense: 9
	},
	{
		name: "Nemesis",
		image: "/assets/image/nemesis.webp",
		attack: 9,
		agility: 5,
		defense: 8.5
	},
	{
		name: "Sherry Birkin",
		image: "/assets/image/sherry.webp",
		attack: 6.5,
		agility: 9,
		defense: 7
	},
	{
		name: "Jake Miller",
		image: "/assets/image/jake.webp",
		attack: 7,
		agility: 9,
		defense: 8
	}
];

try {
	createDeck(); //initial decks
} catch (error) {
	console.error(error);
}

listCardsRemain();
