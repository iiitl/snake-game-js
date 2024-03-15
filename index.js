let board = document.getElementById('board')
let scoreCont = document.getElementById('score')
let maxScoreCont = document.getElementById('maxScoreCont');
let HeadEle;
// console.log(HeadEle);
let inputDir = { x: 0, y: 0 };
//get highest score from local Storage if any other wise 0
const highestScore = localStorage.getItem('highestScore') ? localStorage.getItem('highestScore') : 0;
maxScoreCont.innerHTML = `Max Score: ${highestScore}`;


let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

board.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
});

board.addEventListener('touchend', (event) => {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    const distX = touchendX - touchstartX;
    const distY = touchendY - touchstartY;
    if (Math.abs(distX) > Math.abs(distY)) {
        if (distX > 0) {
            handleDirection("right");
        } else {
            handleDirection("left");
        }
    } else {
        if (distY > 0) {
            handleDirection("down");
        } else {
            handleDirection("up");
        }
    }
}

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}


const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameOver.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
]
let food = {
    x: 6, y: 7
};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < (1 / speed)) {
        return;
    }
    // console.log(ctime);
    lastPaintTime = ctime;
    gameEngine();
    // console.log(ctime);
}
function isCollide(snake) {
    // return false;
    //if you into yourself
    
    if (snake[0].x > 18 || snake[0].x < 0 || snake[0].y > 18 || snake[0].y < 0) {
        return true;
    }
}
function gameEngine() {
    //part1: updating the snake array and food
    if (isCollide(snakeArr)) {
        scoreCont.innerHTML = "Score: 0";
        //if scoreCount-1 is greater then highestScore then change the highestScore to new highestScore i.e. scoreCount-1
        if (snakeArr.length - 1 > highestScore) {
            localStorage.setItem('highestScore', snakeArr.length - 1);
            maxScoreCont.innerHTML = `Highest Score: ${snakeArr.length - 1}`;
        }
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game over. Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }];
        // musicSound.play();
    }

    //IF you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        // console.log("food")
        foodSound.play();

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        // console.log(snakeArr)
        scoreCont.innerHTML = `Score: ${snakeArr.length - 1}`;
        let a = 2;
        let b = 16;
        food = { x: 2 + Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    //Moving the snake
    // console.log("-----")
    // console.log(snakeArr.l)
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        // const element = array[i];
        // console.log("hello");
        snakeArr[i + 1] = { ...snakeArr[i] };
        // console.log(snakeArr[i + 1].x);

    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    //part2: display the snake and food
    //display the snake
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
            // HeadEle = document.querySelectorAll('.head');
            // console.log(e.x, e.y, typeof e.x, typeof e.y)
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
            board.appendChild(snakeElement)
        }
    })

    function handleDirection(dir) {
        moveSound.play();
        switch (dir) {
            case "up":
                inputDir.x = 0;
                inputDir.y = -1;
                break;
            case "down":
                inputDir.x = 0;
                inputDir.y = 1;
                break;
            case "left":
                inputDir.x = -1;
                inputDir.y = 0;
                break;
            case "right":
                inputDir.x = 1;
                inputDir.y = 0;
                break;
            default:
                break;
        }
    }
    
    // Create on-screen buttons for mobile controls
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    
    upButton.addEventListener('click', () => handleDirection("up"));
    downButton.addEventListener('click', () => handleDirection("down"));
    leftButton.addEventListener('click', () => handleDirection("left"));
    rightButton.addEventListener('click', () => handleDirection("right"));

    //part2: display the snake

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

}










//Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    // inputDir = { x: 0, y: 1 } //start the game
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

//touch dir feature for touch screen
function handleDirection(dir) {
    moveSound.play();
    switch (dir) {
        case "up":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "down":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "left":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "right":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
}

