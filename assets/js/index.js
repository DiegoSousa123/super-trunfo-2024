const DEFAULT_IMAGE = "./assets/image/card-placeholder.svg";
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
const menuStart = document.getElementById("button-start");
const menuHelp = document.getElementById("button-help");
const menu = document.getElementById("initial-menu");
const cardFlipAudio = document.getElementById("audio-flip");
const mainThemeMusic = document.getElementById("main-music");
const btnToggleMusic = document.getElementById("btn-toggle-music");
const musicStateText = document.getElementById("music-state-text");
const attrHoverAudio = document.getElementById("audio-hover");

let pointsUser = 0; //User pontuation
let pointsComputer = 0; //Computer pontuation
let user, computer; //get player cards
let userDeck = [],
	computerDeck = []; // cards arrays

//start the game
if (!menu.getAttribute("data-game-element")) {
	menuHelp.addEventListener("click", () => {
		showHelp(); //function from guide.js
	});
	menuStart.addEventListener("click", () => {
		document.querySelectorAll("[data-game-element]").forEach((item) => item.removeAttribute("data-game-element"));
		menu.setAttribute("data-game-element", "");
		mainThemeMusic.volume = 0.45;
		mainThemeMusic.muted = false;
		mainThemeMusic.play();
	});
}

iptRadios.forEach((radio) => {
	radio.addEventListener("click", () => {
		attrHoverAudio.currentTime = 0;
		attrHoverAudio.volume = 0.2;
		attrHoverAudio.play();
	})});

//BUTTONS SECTIONS
hideButton(dialogButtons);
const enableElement = (e) => e.removeAttribute("disabled");
const disableElement = (e) => e.setAttribute("disabled", "true");

playBtn.onclick = () => {
	if (isAttributeSelected()) {
		hideNotChoosedAttribute(getAttributeSelected());
		//shows the computer card
		rotateCard(cardComputer, viewComputer, 180);
		playFlipSound();
		isLegendary(computer, cardComputer);
		disableElement(playBtn); //disable the play btn to prevent some problems...
		let tOut = setTimeout(function () {
			//calls the function to validate who has the greater attribute
			return checkVictory(user, computer);
			clearTimeout(tOut);
		}, 1500);
	}
};

restartBtn.onclick = () => {
	!(pointsUser == 0 && pointsComputer == 0) ? restartGame() : null;
};

//call the getCard function to get a randomly card to user and computer
//list the attributes on the cards and show the user card.
shuffleBtn.onclick = () => {
	let root = document.documentElement,
		t = getComputedStyle(root).getPropertyValue("--shuffle-t");
	user = getCard(userDeck);
	computer = getCard(computerDeck);
	listAttrs(user, computer);
	resetDataChooseAttribute();
	disableElement(shuffleBtn);
	shuffleBtn.classList.add("load-shuffle");
	let tOut = setTimeout(function () {
		rotateCard(cardUser, viewUser, 180);
		playFlipSound();
		isLegendary(user, cardUser);
		enableElement(playBtn);
		shuffleBtn.classList.remove("load-shuffle");
		clearTimeout(tOut);
	}, parseInt(t));
};
//Try again button, restart the game.
dialogRestartButton.onclick = () => {
	restartGame();
	hideButton(dialogButtons);
};

//PLAY FLIP SOUND
function playFlipSound(){
	// cardFlipAudio.currentTime = 0;
	cardFlipAudio.volume = 0.9;
	cardFlipAudio.play();
}

//MAIN MUSIC STATE TOGGLE
let isON = true;
function toggleMainMusic(){
	if(isON){
		mainThemeMusic.pause();
		musicStateText.textContent = "OFF";
		isON = false;
	}else{
		mainThemeMusic.play();
		musicStateText.textContent = "ON";
		isON = true;
	}
}

btnToggleMusic.onclick = () => {
	toggleMainMusic();
}

//LOGIC SECTION

function restartGame() {
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
	const deckVisual = templateItem.content.cloneNode(true);
	const itemsUser = listDeckUser.querySelectorAll(".card-item");
	const itemsComputer = listDeckComputer.querySelectorAll(".card-item");
	const cardsRemainsComputer = document.querySelector("[data-remains-cards='computer']");
	const cardsRemainsUser = document.querySelector("[data-remains-cards='user']");
	clearDeckList(itemsUser);
	clearDeckList(itemsComputer);
	showListDecks(deckVisual, listDeckUser, userDeck.length);
	showListDecks(deckVisual, listDeckComputer, computerDeck.length);
	cardsRemainsComputer.textContent = `${computerDeck.length}`;
	cardsRemainsUser.textContent = `${userDeck.length}`;
}
function clearDeckList(target) {
	target.forEach((item) => {
		item.remove();
	});
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
//remove thr legendary classes
function turnOffLegendary() {
	cardUser.classList.remove("legendary-card");
	cardComputer.classList.remove("legendary-card");
}
//reset all the points
function resetPoints() {
	pointsUser = 0;
	pointsComputer = 0;
	displayPointsUser.textContent = `${pointsUser}`;
	displayPointsComputer.textContent = `${pointsComputer}`;
}
//hide cards, close the dialog if open
function resetState() {
	closeDialog();
	turnOffLegendary();
	rotateCard(cardUser, viewUser, 0);
	rotateCard(cardComputer, viewComputer, 0);
	enableElement(shuffleBtn);
	disableElement(playBtn);
	imgUser.src = DEFAULT_IMAGE;
}

function hideButton(e) {
	e.classList.toggle("hide-button");
}

//function to get randomly card
function getCard(deck) {
	//receives a deck array
	if (!isDeckEmpty(deck)) {
		let rNum = Math.floor(Math.random() * deck.length);
		return deck[rNum];
	}
}

/*
change the data-content-type value attribute to
stylize the dialog based on the type (lose, win, tie). */
function handleDialogContentType(title) {
	const CONTENT_TYPES = {
		win: "win",
		lose: "lose",
		tie: "tie",
		defeat: "lose",
		winner: "win"
	};
	dialogContent.dataset.contentType = CONTENT_TYPES[title];
}
//toggle on the visibility of the restart button in dialog if has a winner or defeated
function handleDialogButtonState(title) {
	if (title === "defeat" || title === "winner") {
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
		dialogRes.addEventListener("animationend", () => {
			resetState();
			dialogRes.classList.remove("animate-dialog");
		});
	}
}
function closeDialog() {
	if (dialogRes instanceof HTMLDialogElement && dialogRes.open) {
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

function getWinner(objUser, objComp, attribute) {
	const userValue = objUser[attribute];
	const compValue = objComp[attribute];
	if (userValue > compValue) {
		return objUser;
	} else if (userValue < compValue) {
		return objComp;
	}
}
function handleVictoryState(winner, user, pc) {
	switch (winner) {
		case user:
			pointsUser++;
			removeCard(pc, computerDeck);
			isDeckEmpty(computerDeck) ? showDialog("winner") : showDialog("win");
			break;
		case pc:
			pointsComputer++;
			removeCard(user, userDeck);
			isDeckEmpty(userDeck) ? showDialog("defeat") : showDialog("lose");
			break;
		default:
			pointsUser++;
			pointsComputer++;
			showDialog("tie");
			break;
	}
}
//function to check if user has won or lose
//receives two Objects
function checkVictory(cardUserObject, cardComputerObject) {
	//gets the value of the checked radiobutton
	let selectedAttr = getAttributeSelected();
	const winner = getWinner(cardUserObject, cardComputerObject, selectedAttr);
	handleVictoryState(winner, cardUserObject, cardComputerObject);
	displayPointsUser.textContent = `${pointsUser}`;
	displayPointsComputer.textContent = `${pointsComputer}`;
	clearRadios();
	listCardsRemain();
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
function isDeckEmpty(deckTarget) {
	const deckIsEmpty = () => Array.isArray(deckTarget) && !deckTarget.length;
	return deckIsEmpty();
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
		if (radio.checked) {
			selected = radio.value;
			break; //breaks the loop when a checked radio is found.
		}
	}
	return selected;
}
function isAttributeSelected() {
	return getAttributeSelected() != null;
}

/* 
function to set date-choose attribute to "yes",
this will hide the computer attributes 
that is not the same selected by user  
*/
function hideNotChoosedAttribute(attr) {
	const computerAttrEquivalent = document.querySelectorAll(".attr-computer");
	for (let item of computerAttrEquivalent) {
		if (item.dataset.attributeName === attr) {
			item.dataset.choose = "yes";
			break;
		}
	}
}
function resetDataChooseAttribute() {
	const computerAttrEquivalent = document.querySelectorAll(".attr-computer");
	for (let item of computerAttrEquivalent) {
		if (item.dataset.choose === "yes") {
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
function shuffleCardArray(array) {
	let old;
	for (let i = array.length - 1; i >= 0; i--) {
		let r_n = Math.floor(Math.random() * (i + 1));
		old = array[i];
		[array[i], array[r_n]] = [array[r_n], old];
	}
	return array;
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
}
var objs = [
    {
        name: "Jill Valentine",
        image: "/assets/image/jill.webp",
        // Arquétipo: Equilibrada/Tática.
        // Ganha de Tanques na agilidade, perde para especialistas em força bruta.
        attack: 8.5,
        agility: 8.5,
        defense: 8.0
    },
    {
        name: "Ada Wong",
        image: "/assets/image/ada-wong.webp",
        // Arquétipo: Velocista.
        // Alta esquiva, defesa mais frágil.
        attack: 7.5,
        agility: 9.5,
        defense: 6.0
    },
    {
        name: "Claire Redfield",
        image: "/assets/image/claire_2.webp",
        // Arquétipo: Sobrevivente.
        // Defesa sólida e agilidade decente.
        attack: 7.0,
        agility: 8.0,
        defense: 8.5
    },
    {
        name: "Piers Nivans",
        image: "/assets/image/piers.webp",
        // Arquétipo: Sniper/Suporte Ofensivo.
        // Ataque alto, mas defesa sacrificada pelo vírus C no final.
        attack: 9.0,
        agility: 7.0,
        defense: 6.5
    },
    {
        name: "Rebecca Chambers",
        image: "/assets/image/rebecca_chambers.webp",
        // Arquétipo: Medic/Support.
        // Atributos baixos em combate, mas surpreende na agilidade contra inimigos pesados.
        attack: 5.5,
        agility: 8.5,
        defense: 6.5
    },
    {
        legend: true,
        name: "Chris Redfield",
        image: "/assets/image/chris.webp",
        // Arquétipo: Legend/Brute.
        // O máximo da força humana. Lento, mas bate e apanha muito.
        attack: 10.0,
        agility: 6.0,
        defense: 9.0
    },
    {
        name: "Ethan Winters",
        image: "/assets/image/ethan.webp",
        // Arquétipo: Tanque de Regeneração.
        // Baixo treino militar (ataque/agilidade menores), mas defesa altíssima (mofo).
        attack: 6.5,
        agility: 6.0,
        defense: 9.5
    },
    {
        name: "Vector",
        image: "/assets/image/vector.webp",
        // Arquétipo: Stealth.
        // Similar a Ada, focado em agilidade e ataque surpresa.
        attack: 8.0,
        agility: 9.0,
        defense: 6.0
    },
    {
        name: "Hunk",
        image: "/assets/image/hunk.webp",
        // Arquétipo: Profissional.
        // Estatísticas muito consistentes. Difícil ter um atributo ruim.
        attack: 8.5,
        agility: 7.5,
        defense: 8.5
    },
    {
        name: "Helena Harper",
        image: "/assets/image/helena.webp",
        // Arquétipo: Agente.
        // Balanceada, levemente inferior a Leon/Jill.
        attack: 7.5,
        agility: 7.0,
        defense: 7.5
    },
    {
        name: "Leon S. Kennedy",
        image: "/assets/image/leon.webp",
        // Arquétipo: Herói de Ação.
        // Excelente agilidade e ataque, defesa média.
        attack: 8.5,
        agility: 9.0,
        defense: 7.5
    },
    {
        name: "Luiz Serra",
        image: "/assets/image/luiz.webp",
        // Arquétipo: Carta "Azarão".
        // Estatísticas baixas, serve para "queimar" a vez ou tentar sorte na defesa.
        attack: 5.0,
        agility: 6.0,
        defense: 7.0
    },
    {
        name: "Carlos Oliveira",
        image: "/assets/image/carlos.webp",
        // Arquétipo: Mercenário Pesado.
        // Bom ataque, lento.
        attack: 8.0,
        agility: 6.5,
        defense: 8.0
    },
    {
        name: "Barry Burton",
        image: "/assets/image/barry.webp",
        // Arquétipo: Canhão de Vidro (Magnum).
        // Ataque massivo, mas idade pesa na agilidade.
        attack: 9.5,
        agility: 5.0,
        defense: 8.0
    },
    {
        name: "Bitorez",
        image: "/assets/image/bitorez.webp",
        // Arquétipo: Boss Inicial.
        // Forte e resistente, mas muito lento.
        attack: 9.0,
        agility: 5.0,
        defense: 9.0
    },
    {
        legend: true,
        name: "Albert Wesker",
        image: "/assets/image/wesker.webp",
        // Arquétipo: Legend/God Tier.
        // Agilidade máxima. Só perde em Defesa para Tanques puros (Nemesis/Ethan).
        attack: 9.5,
        agility: 10.0,
        defense: 8.0
    },
    {
        name: "Krauser",
        image: "/assets/image/krauser.webp",
        // Arquétipo: Duelista.
        // Combate direto forte, defesa alta devido a mutação.
        attack: 9.0,
        agility: 8.0,
        defense: 8.5
    },
    {
        name: "Nemesis",
        image: "/assets/image/nemesis.webp",
        // Arquétipo: Juggernaut.
        // A maior defesa do jogo. Agilidade péssima.
        attack: 9.0,
        agility: 5.5,
        defense: 10.0
    },
    {
        name: "Sherry Birkin",
        image: "/assets/image/sherry.webp",
        // Arquétipo: Regeneradora Ágil.
        // Baixo ataque, mas excelente sobrevivência e fuga.
        attack: 6.0,
        agility: 8.0,
        defense: 7.5
    },
    {
        name: "Jake Muller",
        image: "/assets/image/jake.webp",
        // Arquétipo: Lutador.
        // Atributos físicos altos herdados de Wesker, mas menos refinado.
        attack: 8.5,
        agility: 8.5,
        defense: 7.5
    },
	{
		name: "Ultimate Abyss",
		image: "/assets/image/Ultimate_Abyss.webp",
		attack: 10,
		agility: 8,
		defense: 7.5
	},
	{
		name: "Eveline",
		image: "/assets/image/eveline.webp",
		attack: 7.5,
		agility: 9,
		defense: 8
	},{
		name: "Grace Ashcroft",
		image: "/assets/image/grace_ashcroft.webp",
		attack: 8.5,
		agility: 8,
		defense: 7
	},
	{
		name: "Lady Hunk",
		image: "/assets/image/Lady_hunk.webp",
		attack: 7,
		agility: 8,
		defense: 7.5
	}
];

try {
	createDeck(); //initial decks
} catch (error) {
	console.error(error);
}

listCardsRemain();
