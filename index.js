let board = document.getElementById("board");
let scoreCont = document.getElementById("score");
let maxScoreCont = document.getElementById("maxScoreCont");
const pauseBtn = document.getElementById("pauseBtn");
const muteBtn = document.getElementById("muteBtn");
const fullScreenBtn = document.getElementById("fullScreenBtn");
let difficultyMode = "easy";
document.getElementById("easyBtn").classList.add("selected");
let obstacles = [];

let HeadEle;
// console.log(HeadEle);
let inputDir = { x: 0, y: 0 };

const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameOver.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = {
  x: 6,
  y: 7,
};

// Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
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

  // Modified conditions to check collision with obstacles
  if (
    snake[0].x > 18 ||
    snake[0].x < 0 ||
    snake[0].y > 18 ||
    snake[0].y < 0 ||
    (difficultyMode === "medium" && snake[0].x === 9 && snake[0].y === 9) ||
    (difficultyMode === "hard" &&
      ((snake[0].x === 5 && snake[0].y === 5) ||
        (snake[0].x === 5 && snake[0].y === 13) ||
        (snake[0].x === 13 && snake[0].y === 5) ||
        (snake[0].x === 13 && snake[0].y === 13)))
  ) {
    return true;
  }
}

// To check if food overlaps with any obstacle
function isFoodOnObstacles(obstacles, foodPosition) {
    for (let obstacle of obstacles) {
      if (obstacle.x === foodPosition.x && obstacle.y === foodPosition.y) {
        return true;
      }
    }
    return false;
  }

function gameEngine() {
  if (isPaused) {
    return;
  }
  // animationId = requestAnimationFrame(main);

  //part1: updating the snake array and food
  if (isCollide(snakeArr)) {
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

    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    // console.log(snakeArr)
    do {
        let a = 2;
        let b = 16;
        food = {
          x: 2 + Math.round(a + (b - a) * Math.random()),
          y: Math.round(a + (b - a) * Math.random()),
        };
      } while (isFoodOnObstacles(obstacles, food));
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
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    // Displaying obstacles as per difficulty mode
    obstacles.forEach((obstacle) => {
      let obstacleElement = document.createElement("div");
      obstacleElement.classList.add("obstacle");
      obstacleElement.style.gridRowStart = obstacle.y;
      obstacleElement.style.gridColumnStart = obstacle.x;
      board.appendChild(obstacleElement);
    });
    if (index === 0) {
      eyes = document.createElement("div");
      eyes.classList.add("eyes");
      eyes2 = document.createElement("div");
      eyes2.classList.add("eyes");
      snakeElement.classList.add("head");
      // HeadEle = document.querySelectorAll('.head');
      // console.log(e.x, e.y, typeof e.x, typeof e.y)
      if (inputDir.x === 0 && inputDir.y === -1) {
        snakeElement.style.setProperty("--top", "15%");
        snakeElement.style.setProperty("--bottom", "75%");
        snakeElement.style.setProperty("--left", "2%");
        snakeElement.style.setProperty("--right", "2%");
        snakeElement.style.setProperty("--direction", "row");
      } else if (inputDir.x === 0 && inputDir.y === 1) {
        snakeElement.style.setProperty("--top", "75%");
        snakeElement.style.setProperty("--bottom", "15%");
        snakeElement.style.setProperty("--left", "2%");
        snakeElement.style.setProperty("--right", "2%");
        snakeElement.style.setProperty("--direction", "row");
      } else if (inputDir.x === -1 && inputDir.y === 0) {
        snakeElement.style.setProperty("--top", "2%");
        snakeElement.style.setProperty("--bottom", "2%");
        snakeElement.style.setProperty("--left", "15%");
        snakeElement.style.setProperty("--right", "75%");
        snakeElement.style.setProperty("--direction", "column");
      } else if (inputDir.x === 1 && inputDir.y === 0) {
        snakeElement.style.setProperty("--top", "2%");
        snakeElement.style.setProperty("--bottom", "2%");
        snakeElement.style.setProperty("--left", "75%");
        snakeElement.style.setProperty("--right", "15%");
        snakeElement.style.setProperty("--direction", "column");
      }
      board.appendChild(snakeElement);
      snakeElement.appendChild(eyes);
      snakeElement.appendChild(eyes2);
    } else {
      snakeElement.classList.add("snake");
      board.appendChild(snakeElement);
    }
  });

  //part2: display the snake

  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Added Functionalities
pauseBtn.addEventListener("click", () => {
  togglePause();
  pauseBtn.classList.toggle("paused");
});

muteBtn.addEventListener("click", () => {
  toggleMute();
  muteBtn.classList.toggle("muted");
});

fullScreenBtn.addEventListener("click", () => {
  toggleFullScreen();
  fullScreenBtn.classList.toggle("fullscreen");
});

// Function to toggle pause
let isPaused = false;

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    isPaused = true;
  } else {
    isPaused = false;
  }
}

// Function to toggle mute
let isMuted = false;

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    // Mute all sounds
    foodSound.muted = true;
    gameOverSound.muted = true;
    moveSound.muted = true;
    musicSound.muted = true;
  } else {
    // Unmute all sounds
    foodSound.muted = false;
    gameOverSound.muted = false;
    moveSound.muted = false;
    musicSound.muted = false;
  }
}

// Function to toggle full screen
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // Request full screen
    document.documentElement.requestFullscreen();
  } else {
    // Exit full screen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

document.getElementById("easyBtn").addEventListener("click", function () {
  setDifficultyMode("easy");
  document.getElementById("easyBtn").classList.toggle("selected");
  document.getElementById("mediumBtn").classList.remove("selected");
  document.getElementById("hardBtn").classList.remove("selected");
});

document.getElementById("mediumBtn").addEventListener("click", function () {
  setDifficultyMode("medium");
  document.getElementById("mediumBtn").classList.toggle("selected");
  document.getElementById("easyBtn").classList.remove("selected");
  document.getElementById("hardBtn").classList.remove("selected");
});

document.getElementById("hardBtn").addEventListener("click", function () {
  setDifficultyMode("hard");
  document.getElementById("hardBtn").classList.toggle("selected");
  document.getElementById("easyBtn").classList.remove("selected");
  document.getElementById("mediumBtn").classList.remove("selected");
});

function setDifficultyMode(mode) {
  difficultyMode = mode;
  if (mode === "easy") {
    obstacles = [];
  } else if (mode === "medium") {
    obstacles = [{ x: 9, y: 9 }]; // One obstacle in the center
  } else if (mode === "hard") {
    obstacles = [
      { x: 5, y: 5 },
      { x: 5, y: 13 },
      { x: 13, y: 5 },
      { x: 13, y: 13 },
    ];
  }
  gameEngine();
}

//Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
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