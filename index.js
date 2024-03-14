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

// Game engine logic
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game over. Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }];
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

// Increase speed function
function increaseSpeed() {
    speed += 0.1; // Increase speed by 0.1 units
}

// Reset speed function
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
