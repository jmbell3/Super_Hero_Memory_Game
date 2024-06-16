const gameContainer = document.querySelector('.game-container'); // Container for the game cards
const pointsDisplay = document.getElementById('points'); // Display for points
const newGameButton = document.getElementById('new-game'); // Button to start a new game
const winMessage = document.getElementById('win-message'); // Message shown when the player wins
const loseMessage = document.getElementById('lose-message'); // Message shown when the player loses

// Array of card objects with names and images
const cardsArray = [
    { name: 'batman', img: 'batman.png' },
    { name: 'joker', img: 'joker.png' },
    { name: 'superman', img: 'superman.png' },
    { name: 'wonderwoman', img: 'wonderwoman.png' },
    { name: 'flash', img: 'flash.png' },
    { name: 'greenlantern', img: 'greenlantern.png' },
];

let points = 0; // Points start at 0
let hasFlippedCard = false; // Tracks if the first card has been flipped
let lockBoard = false; // Locks the board to prevent flipping more than two cards
let firstCard, secondCard; // Stores the first and second flipped cards
let doubledCardsArray = []; // Array of doubled cards for the game
let matchedPairs = 0; // Tracks the number of matched pairs
let turns = 0; // Tracks the number of turns taken
const maxTurns = 24; // Maximum number of turns allowed before losing

// Initializes the game
function startGame() {
    points = 0; // Reset points
    pointsDisplay.textContent = points; // Update points display
    matchedPairs = 0;  
    hasFlippedCard = false; 
    lockBoard = false; 
    firstCard = null; 
    secondCard = null; 
    turns = 0; // Reset turns
    winMessage.classList.add('hidden'); // Hide win message
    loseMessage.classList.add('hidden'); // Hide lose message
    doubledCardsArray = [...cardsArray, ...cardsArray]; // Create doubled array of cards
    shuffle(doubledCardsArray); // Shuffle the cards
    gameContainer.classList.remove('hidden'); // Show game container
    gameContainer.innerHTML = doubledCardsArray.map(card => createCard(card)).join(''); // Create and insert HTML
    document.querySelectorAll('.card').forEach(card => card.addEventListener('click', flipCard)); // Add click event to each card
}

// Shuffles the cards array
function shuffle(array) {
    array.sort(() => 0.5 - Math.random()); // Creates Random cards with math function
}

// Creates the HTML for a card
function createCard(card) {
    return `
        <div class="card" data-name="${card.name}">
            <img class="front-face" src="${card.img}" alt="${card.name}">
            <img class="back-face" src="https://static.vecteezy.com/system/resources/thumbnails/013/836/452/small/comic-lettering-bang-comic-speech-bubble-with-emotional-text-bang-bright-dynamic-cartoon-illustration-in-retro-pop-art-style-comic-text-sound-effects-png.png" alt="Superhero Logo">
        </div>
    `;
}

// Handles the card flip logic
function flipCard() {
    if (lockBoard) return; 
    if (this === firstCard) return; // If the card is the first card, do nothing
    this.classList.add('flip'); // Flip the card
    if (!hasFlippedCard) {
        hasFlippedCard = true; // Flipped card
        firstCard = this; // 
        return;
    }
    secondCard = this; // Set the second card reference
    checkForMatch(); 
}

// Checks if the two flipped cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name; // Check if the cards match
    isMatch ? disableCards() : unflipCards(); // If it iss a match, disable cards
    updateTurns(); 
    checkGameOver();
}

// Disables the matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard); // Remove click event from first card
    secondCard.removeEventListener('click', flipCard); // Remove click event from second card
    updatePoints(); 
    matchedPairs++; 
    if (matchedPairs === cardsArray.length) { // If all pairs are matched
        winMessage.classList.remove('hidden'); // Show win message
        gameContainer.classList.add('hidden'); // Hide game container
        winMessage.style.display = 'block'; // Win message will display
    }
    resetBoard(); // Reset the board
}

// Unflips the unmatched cards
function unflipCards() {
    lockBoard = true; // Lock the board
    setTimeout(() => {
        firstCard.classList.remove('flip'); // Unflip first card
        secondCard.classList.remove('flip'); // Unflip second card
        resetBoard();
    }, 1500); // Transition timme
}

// Updates the points
function updatePoints() {
    points += 10; // Add 10 points
    pointsDisplay.textContent = points; // Update points 
}

// Updates the number of turns taken
function updateTurns() {
    turns++; 
}

// Checks if the game is over
function checkGameOver() {
    if (turns >= maxTurns && matchedPairs !== cardsArray.length) { // If max turns reached and not all pairs matched
        loseGame(); // End the game as a loss
    }
}

// Handles the game over scenario 
function loseGame() {
    gameContainer.classList.add('hidden'); // Hide game container
    loseMessage.classList.remove('hidden'); // Show lose message
    loseMessage.style.display = 'block'; // Lose message is displayed
}

// Resets the board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Reset flip 
    [firstCard, secondCard] = [null, null]; // Clear card 
}

// Adds event listener to start a new game
newGameButton.addEventListener('click', startGame);
startGame(); // Start the game 
