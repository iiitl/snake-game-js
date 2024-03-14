let board = document.getElementById('board');
let scoreCont = document.getElementById('score');
let maxScoreCont = document.getElementById('maxScoreCont');
let HeadEle;
let inputDir = { x: 0, y: 0 };

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameOver.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Check collision with walls or self
function isCollide(snake) {
    if (snake[0].x > 18 || snake[0].x < 0 || snake[0].y > 18 || snake[0].y < 0) {
        return true;
    }
}

// Function to calculate player's score
function calculatePlayerScore() {
    return snakeArr.length - 1;
}

// Function to get the highest score
function getHighestScore() {
    let highestScore = localStorage.getItem('highestScore');
    if (!highestScore) {
        highestScore = 0;
    }
    return highestScore;
}

// Function to set the highest score
function setHighestScore(score) {
    localStorage.setItem('highestScore', score);
}

// Function to check if the player achieved a new highest score
function isNewHighestScore() {
    const playerScore = calculatePlayerScore();
    const highestScore = getHighestScore();
    return playerScore > highestScore;
}

// Function to display the game over popup
function showGameOverPopup() {
    const popup = document.getElementById('gameOverPopup');
    const playerScoreElement = document.getElementById('playerScorePopup');
    const highestScoreElement = document.getElementById('maxScorePopup');
    const newHighScoreIndicator = document.getElementById('newHighScoreIndicator');

    playerScoreElement.textContent = calculatePlayerScore();
    highestScoreElement.textContent = getHighestScore();

    if (isNewHighestScore()) {
        newHighScoreIndicator.style.display = 'block';
    } else {
        newHighScoreIndicator.style.display = 'none';
    }

    popup.style.display = 'block';
}

// Function to hide the game over popup
function hideGameOverPopup() {
    const popup = document.getElementById('gameOverPopup');
    popup.style.display = 'none';
}

// Event listener for the "Play Again" button
document.getElementById('playAgainBtn').addEventListener('click', () => {
    hideGameOverPopup();
    resetGame();
});

// Function to reset the game
function resetGame() {
    resetSpeed();
    snakeArr = [{ x: 13, y: 15 }]; // Reset snake position
    food = { x: 6, y: 7 }; // Reset food position
    window.requestAnimationFrame(main); // Restart the game loop
}

// Game engine logic
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        showGameOverPopup();
        if (isNewHighestScore()) {
            setHighestScore(calculatePlayerScore());
        }
        return; // Exit the game engine
    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: 2 + Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        increaseSpeed(); // Increase speed when food is consumed
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            eyes = document.createElement('div');
            eyes.classList.add('eyes');
            eyes2 = document.createElement('div');
            eyes2.classList.add('eyes');
            snakeElement.classList.add('head');
            if (inputDir.x === 0 && inputDir.y === -1) {
                snakeElement.style.setProperty('--top', '15%');
                snakeElement.style.setProperty('--bottom', '75%');
                snakeElement.style.setProperty('--left', '2%');
                snakeElement.style.setProperty('--right', '2%');
                snakeElement.style.setProperty('--direction', 'row');
            }
            else if (inputDir.x === 0 && inputDir.y === 1) {
                snakeElement.style.setProperty('--top', '75%');
                snakeElement.style.setProperty('--bottom', '15%');
                snakeElement.style.setProperty('--left', '2%');
                snakeElement.style.setProperty('--right', '2%');
                snakeElement.style.setProperty('--direction', 'row');
            }
            else if (inputDir.x === -1 && inputDir.y === 0) {
                snakeElement.style.setProperty('--top', '2%');
                snakeElement.style.setProperty('--bottom', '2%');
                snakeElement.style.setProperty('--left', '15%');
                snakeElement.style.setProperty('--right', '75%');
                snakeElement.style.setProperty('--direction', 'column');
            }
            else if (inputDir.x === 1 && inputDir.y === 0) {
                snakeElement.style.setProperty('--top', '2%');
                snakeElement.style.setProperty('--bottom', '2%');
                snakeElement.style.setProperty('--left', '75%');
                snakeElement.style.setProperty('--right', '15%');
                snakeElement.style.setProperty('--direction', 'column');
            }
            board.appendChild(snakeElement);
            snakeElement.appendChild(eyes);
            snakeElement.appendChild(eyes2);
        }
        else {
            snakeElement.classList.add('snake');
            board.appendChild(snakeElement);
        }
    })

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Function to increase speed
function increaseSpeed() {
    speed += 0.1; // Increase speed by 0.1 units
}

// Function to reset speed
function resetSpeed() {
    speed = 5; // Reset speed to initial value
}

// Initial call to main function
window.requestAnimationFrame(main);

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
