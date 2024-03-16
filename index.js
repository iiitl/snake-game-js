// HTML DOM elements
let board = document.getElementById('board'); // Reference to the game board
let scoreCont = document.getElementById('score'); // Reference to the element displaying current score
let maxScoreCont = document.getElementById('maxScoreCont'); // Reference to the element displaying maximum score
let inputDir = { x: 0, y: 0 }; // Direction of snake movement

// Audio elements
const foodSound = new Audio('music/food.mp3'); // Sound when snake eats food
const gameOverSound = new Audio('music/gameOver.mp3'); // Sound when game ends
const moveSound = new Audio('music/move.mp3'); // Sound when snake moves
const musicSound = new Audio('music/music.mp3'); // Background music

// Game parameters
let speed = 5; // Initial speed of the snake
let lastPaintTime = 0; // Time of last frame
let snakeArr = [{ x: 13, y: 15 }]; // Initial snake position
let food = { x: 6, y: 7 }; // Initial food position
let score = 0; // Initial score
let animationId; // Variable to store animation frame ID

// Function to update and store the maximum score in local storage
function updateMaxScore(score) {
    let maxScore = localStorage.getItem('maxScore');
    if (!maxScore || score > maxScore) {
        localStorage.setItem('maxScore', score);
    }
}

// Function to display the current score and the maximum score on the interface
function displayScores() {
    scoreCont.innerText = "Score: " + score;
    maxScoreCont.innerText = "Max Score: " + localStorage.getItem('maxScore');
}

// Retrieving the maximum score from local storage or setting it to 0 if not found
let maxScore = localStorage.getItem('maxScore') || 0;
displayScores(); // Displaying initial scores

// Main game loop
function main(ctime) {
    animationId = window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Function to check collision
function isCollide(snake) {
    if (snake[0].x > 18 || snake[0].x < 0 || snake[0].y > 18 || snake[0].y < 0) {
        return true;
    }
}

// Function to end the game
function endGame() {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    updateMaxScore(score); // Update maximum score
    if (score > maxScore) {
        alert("Congratulations🎉! You have achieved a new high score! Press any key to play again");
    } else {
        alert("Game over. Press any key to play again");
    }
    score = 0; // Reset score
    displayScores(); // Display scores
    snakeArr = [{ x: 13, y: 15 }]; // Reset snake position
}

// Game engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        endGame();
        return;
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score++; // Increment score when snake eats food
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: 2 + Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Displaying the snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            let eyes = document.createElement('div');
            eyes.classList.add('eyes');
            let eyes2 = document.createElement('div');
            eyes2.classList.add('eyes');
            snakeElement.classList.add('head');
            if (inputDir.x === 0 && inputDir.y === -1) {
                snakeElement.style.setProperty('--top', '15%');
                snakeElement.style.setProperty('--bottom', '75%');
                snakeElement.style.setProperty('--left', '2%');
                snakeElement.style.setProperty('--right', '2%');
                snakeElement.style.setProperty('--direction', 'row');
            } else if (inputDir.x === 0 && inputDir.y === 1) {
                snakeElement.style.setProperty('--top', '75%');
                snakeElement.style.setProperty('--bottom', '15%');
                snakeElement.style.setProperty('--left', '2%');
                snakeElement.style.setProperty('--right', '2%');
                snakeElement.style.setProperty('--direction', 'row');
            } else if (inputDir.x === -1 && inputDir.y === 0) {
                snakeElement.style.setProperty('--top', '2%');
                snakeElement.style.setProperty('--bottom', '2%');
                snakeElement.style.setProperty('--left', '15%');
                snakeElement.style.setProperty('--right', '75%');
                snakeElement.style.setProperty('--direction', 'column');
            } else if (inputDir.x === 1 && inputDir.y === 0) {
                snakeElement.style.setProperty('--top', '2%');
                snakeElement.style.setProperty('--bottom', '2%');
                snakeElement.style.setProperty('--left', '75%');
                snakeElement.style.setProperty('--right', '15%');
                snakeElement.style.setProperty('--direction', 'column');
            }
            board.appendChild(snakeElement);
            snakeElement.appendChild(eyes);
            snakeElement.appendChild(eyes2);
        } else {
            snakeElement.classList.add('snake');
            board.appendChild(snakeElement);
        }
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    displayScores(); // Update and display scores
}

// Start the game loop
main();

// Event listener for keyboard input
window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

// Define variables for buttons
const pauseBtn = document.getElementById('pauseBtn');
const muteBtn = document.getElementById('muteBtn');
const fullScreenBtn = document.getElementById('fullScreenBtn');

// Add event listeners for buttons
pauseBtn.addEventListener('click', togglePause);
muteBtn.addEventListener('click', toggleMute);
fullScreenBtn.addEventListener('click', toggleFullScreen);

// Define variables for game state
let isPaused = false;
let isMuted = false;

// Function to toggle pause
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        cancelAnimationFrame(animationId); // Stop game loop
    } else {
        animationId = requestAnimationFrame(main); // Resume game loop
    }
}

// Function to toggle mute
function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        foodSound.muted = true;
        gameOverSound.muted = true;
        moveSound.muted = true;
        musicSound.muted = true;
    } else {
        foodSound.muted = false;
        gameOverSound.muted = false;
        moveSound.muted = false;
        musicSound.muted = false;
    }
}

// Function to toggle full screen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
