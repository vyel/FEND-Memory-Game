/************************************************
The following code was written in the order of
the game's functionality: create the deck cards,
click on card, start timer, start moves counter,
start rating, compare cards, check if game is
over. Reset button was created next and the reset
function which will also be used for the new game
button. When all cards are matched: open won pop-up
message which will contain a congratulatory message,
number of moves, time elapsed, number of stars,
and new game button.
************************************************/
 
/***********************************************
	Const variables
	- except newGame and restart buttons
************************************************/
const cardsList = [["icon", "pikachu"], ["icon", "pikachu"], ["icon", "charmander"], ["icon", "charmander"], ["icon", "bullbasaur"], ["icon", "bullbasaur"], ["icon", "jigglypuff"], ["icon", "jigglypuff"], ["icon", "meowth"], ["icon", "meowth"], ["icon", "mankey"], ["icon", "mankey"], ["icon", "venonat"], ["icon", "venonat"], ["icon", "pidgey"], ["icon", "pidgey"]];
const cardsContainer = document.querySelector(".deck");
const timerContainer = document.querySelector(".timer");
const movesContainer = document.querySelector(".moves");
const starsContainer = document.querySelector(".stars");


/***********************************************
	Deck card creation:
	- create cards function
	- shuffle cards function
	- add click event listeners
	- cards compararison function
	- game completed (game over) function
***********************************************/

// Initialize the game

let shuffledCards = shuffle(cardsList);
let openCards = [];
let matchedCards = [];

function init() {
	// Create the cards
	for (let i=0; i<shuffledCards.length; i++){
		const card = document.createElement("li");
		card.innerHTML = `<img class="${shuffledCards[i][0]} ${shuffledCards[i][1]}" src="img/${shuffledCards[i][1]}.svg">`;
		card.classList.add("card");
		cardsContainer.appendChild(card);
		// Add click event listeners
		click(card);
	};

	timerContainer.innerHTML = "00m : 00s";
}

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };

    return array;
}


//	Card click event

function click(card) {
	card.addEventListener("click", function(){
		const currentCard = this;
		const previousCard = openCards[0];

		// Check to see if we have an existing open card; compare if yes
		if(openCards.length===1){
			card.classList.add("open", "show", "disable");
			openCards.push(this);

			compare(currentCard, previousCard);
		} else {
			currentCard.classList.add("open", "show", "disable");
			openCards.push(this);
		};

		// add moves to the counter
		addMove();
		//set the rating
		removeStar();
	});
}


//	Compare the cards and add animations

function compare(currentCard, previousCard){

	if (currentCard.innerHTML === previousCard.innerHTML){
		currentCard.classList.add("match", "matching");
		previousCard.classList.add("match", "matching");

		matchedCards.push(currentCard, previousCard);

		openCards = [];

		// Check if game is over
		setTimeout(function(){
			gameCompleted();
		}, 300);
	} else {
		currentCard.classList.add("flipping");
		previousCard.classList.add("flipping");

		setTimeout(function(){

			currentCard.classList.remove("open", "show", "disable", "flipping");
			previousCard.classList.remove("open", "show", "disable", "flipping");

			openCards = [];
		}, 300);
	};
}

// Game over function

function gameCompleted(){
	if (matchedCards.length === shuffledCards.length) {
		timerStop();
		wonMessagePopUp();
	};
}

/**********************************************
	Score panel functions:
		- star rating function and reset function
		- move function
		- timer function and reset function
		- restart button
***********************************************/

// Stars rating

function removeStar (){
	let stars = starsContainer.querySelectorAll(".fa-star");
	let lastStar = stars[stars.length - 1];
	switch(moves){
		case 26:
			lastStar.classList.replace("fa-star", "fa-star-o");
			break;
		case 36:
			lastStar.classList.replace("fa-star", "fa-star-o");
			break;
	};
}

function resetStarsRating () {
	let stars = starsContainer.querySelectorAll(".fa-star-o");
	stars.forEach(function(el){
		el.classList.replace("fa-star-o", "fa-star");
	});
}

//	Add moves

movesContainer.innerHTML = "0 Moves";
let moves = 0;
function addMove(){
	moves++;
	movesContainer.innerHTML = `${parseInt(moves/2)} Moves`;
	if (moves===1){ timerStart(); };
}

// Timer

let seconds = 0, timer;
function timerStart(){

	let timerContainer = document.querySelector(".timer");
	clearTimeout(timer);
	timer = setTimeout(function(){
		seconds++;
		timerStart();
	}, 1000);

	timerContainer.innerHTML = formatSecondsToMinutes(seconds);
}

function formatSecondsToMinutes (seconds){
	let minutes = (seconds-(seconds%=60))/60;
	return (( minutes < 10 ? "0" + minutes + "m" : minutes) + (seconds < 10 ?' : 0':' : '))+seconds + "s";
}

function timerStop(){
	clearTimeout(timer);
}

function resetTimer(){
	clearTimeout(timer);
}

//	Restart button

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", resetGame);


/**************************************************
	Reset game function:

	- applies to reset button and new game button
**************************************************/
function resetGame(){
	// delete old cards
	cardsContainer.innerHTML = [];

	//shuffle cards
	shuffledCards = shuffle(cardsList);

	// init/ call init to create new cards
	init();

	// reset any related variables
	matchedCards = [];
	openCards = [];

	// reset Moves
	movesContainer.innerHTML = "0 Moves";
	moves = 0;

	// reset timer
	seconds = 0;
	resetTimer();

	//reset stars
	resetStarsRating();

	//reset won modal
	document.querySelector(".wonMessageModal").classList.add("hideWonModal");
}

/*************************************
	Won Modal:
		- won modal function
		- new  game button
		- close modal click event
*************************************/

// Won modal function

function wonMessagePopUp() {
	let wonMessage = document.querySelector(".wonMessage");
	// wonMessage.innerHTML = `You have completed the game in ${formatSecondsToMinutes(timer)} with ${moves} moves.`;
	//For some reasons the above line shows an incorrect timer (around 15 seconds plus difference.)
	wonMessage.innerHTML = `You've found all the Pokemon in ${document.querySelector(".timer").textContent} with ${parseInt(moves/2)} moves.`;
	let starsWon = document.querySelector(".starsWon");
	starsWon.innerHTML = document.querySelector(".stars").innerHTML;

	const wonMessageModal = document.querySelector(".wonMessageModal").classList.remove("hideWonModal");
}

// New game button

const newGameButton = document.querySelector(".newGameBtn");
	newGameButton.addEventListener("click", resetGame);


// Click event: close won modal by clicking outside, start new game by clicking the new game button

window.onclick = function(event){
	const wonMessageModal = document.querySelector(".wonMessageModal");
	if (event.target === wonMessageModal){
		wonMessageModal.classList.add("hideWonModal");
	};
};

/***************************
	Start the game
****************************/
init();
