const gameScreen = document.querySelector("#game-screen");
const canvas = document.querySelector("canvas");
canvas.style.border = "2px solid grey";
const ctx = canvas.getContext("2d");
const startScreen = document.querySelector("#start-screen");
const gameOverScreen = document.querySelector("#game-over");
const startBtn = document.querySelector("#start-button");
const restartBtn = document.querySelector("#restart-button");

//variables
let scoreElement = document.querySelector("#score");
let score = 0;
let intervalId = 0;
let isGameOver = false;

const background = new Image();
background.src = "../images/bg.png";

const bird = new Image();
bird.src = "../images/flappy.png";
let birdX = 50;
let birdY = 50;
let birdSize = 60;
let birdSpeed = 2;
let falling = true;

const pipeTop = new Image();
pipeTop.src = "../images/obstacle_top.png";
const pipeBottom = new Image();
pipeBottom.src = "../images/obstacle_bottom.png";

const pipeGap = 250;
const pipeWidth = 100;
const pipeHeight = 500;
let pipeSpeed = 2;
let pipeTopY = 0;
let pipeBottomY = pipeTopY + pipeHeight + pipeGap;
let pipeX = 300;
let pipeArray = [
  { x: canvas.width + 100, y: -Math.floor(Math.random() * pipeHeight) },
  { x: canvas.width + 500, y: -Math.floor(Math.random() * pipeHeight) },
  { x: canvas.width + 900, y: -Math.floor(Math.random() * pipeHeight) },
];

window.onload = function () {
  //on load, show the start screen and hide the other screens
  showStartScreen();

  startBtn.onclick = function () {
    hideStartScreen();
    startGame();
  };
  restartBtn.onclick = function () {
    //reset all variables
    intervalId = 0;
    isGameOver = false;
    birdX = 50;
    birdY = 50;
    pipeArray = [
      { x: canvas.width + 100, y: -Math.floor(Math.random() * pipeHeight) },
      { x: canvas.width + 500, y: -Math.floor(Math.random() * pipeHeight) },
      { x: canvas.width + 900, y: -Math.floor(Math.random() * pipeHeight) },
    ];
    hideStartScreen();
    startGame();
  };

  document.addEventListener("keypress", (e) => {
    if (e.code === "Space") {
      falling = false;
      handleFly();
    }
  });

  function startGame() {
    gameScreen.style.display = "flex";
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(bird, birdX, birdY, birdSize, birdSize);

    //bird is always falling
    if (falling) {
      birdY += birdSpeed;
    } else {
      birdY -= birdSpeed + 2;
    }

    //for loop for pipes array
    for (let i = 0; i < pipeArray.length; i++) {
      let currentPipe = pipeArray[i];
      ctx.drawImage(
        pipeTop,
        currentPipe.x,
        currentPipe.y,
        pipeWidth,
        pipeHeight
      );
      ctx.drawImage(
        pipeBottom,
        currentPipe.x,
        currentPipe.y + pipeGap + pipeHeight,
        pipeWidth,
        pipeHeight
      );

      currentPipe.x -= pipeSpeed;
      // bring pipes back to right side of the screen
      if (currentPipe.x < -150) {
        currentPipe.x = canvas.width + 400;
        currentPipe.y = -Math.floor(Math.random() * pipeHeight);
      }

      //score increase
      if (
        currentPipe.x + pipeWidth <= birdX &&
        currentPipe.x + pipeWidth > birdX - pipeSpeed
      ) {
        score++;
        scoreElement.innerText = score;
      }

      //collisions with pipes
      if (
        //collision with top pipe
        (birdX + birdSize >= currentPipe.x &&
          birdY <= currentPipe.y + pipeHeight &&
          birdX <= currentPipe.x + pipeWidth) ||
        //collision with bottom pipe
        (birdX + birdSize >= currentPipe.x &&
          birdY + birdSize >= currentPipe.y + pipeHeight + pipeGap &&
          birdX <= currentPipe.x + pipeWidth)
      ) {
        isGameOver = true;
      }
    }

    //if bird touches bottom or top of canvas, game is over
    if (birdY < 0 || birdY + birdSize > canvas.height) isGameOver = true;

    if (isGameOver) {
      gameOver();
    } else {
      intervalId = requestAnimationFrame(startGame);
    }
  }

  function hideStartScreen() {
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    canvas.style.display = "flex";
    gameOverScreen.style.display = "none";
  }

  function showStartScreen() {
    canvas.style.display = "none";
    gameOverScreen.style.display = "none";
    gameScreen.style.display = "none";
  }

  function gameOver() {
    cancelAnimationFrame(intervalId);
    canvas.style.display = "none";
    gameOverScreen.style.display = "block";
    gameScreen.style.display = "none";
    score = 0;
  }

  function handleFly() {
    setTimeout(() => {
      falling = true;
    }, 200);
  }
};
