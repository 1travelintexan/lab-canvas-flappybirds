const gameScreen = document.querySelector("#game-screen");
const canvas = document.querySelector("canvas");
canvas.style.border = "2px solid grey";
const ctx = canvas.getContext("2d");
const startScreen = document.querySelector("#start-screen");
const gameOverScreen = document.querySelector("#game-over");
const startBtn = document.querySelector("#start-button");
const restartBtn = document.querySelector("#restart-button");
let scoreElementGameOver = document.querySelector("#score-gameover");
let scoreElement = document.querySelector("#score");

//variables
let score = 0;
let intervalId = 0;
let isGameOver = false;

const background = new Image();
background.src = "../images/bg.png";
let background1x = 0;
let background2x = canvas.width;
const background2 = new Image();
background2.src = "../images/bg.png";

const bee = new Image();
let beeIndex = 0;
const sprites = [
  "../images/bee-sprites/sprites/skeleton-animation_00.png",
  "../images/bee-sprites/sprites/skeleton-animation_01.png",
  "../images/bee-sprites/sprites/skeleton-animation_02.png",
  "../images/bee-sprites/sprites/skeleton-animation_03.png",
  "../images/bee-sprites/sprites/skeleton-animation_04.png",
  "../images/bee-sprites/sprites/skeleton-animation_05.png",
  "../images/bee-sprites/sprites/skeleton-animation_06.png",
  "../images/bee-sprites/sprites/skeleton-animation_07.png",
  "../images/bee-sprites/sprites/skeleton-animation_08.png",
  "../images/bee-sprites/sprites/skeleton-animation_09.png",
  "../images/bee-sprites/sprites/skeleton-animation_10.png",
  "../images/bee-sprites/sprites/skeleton-animation_11.png",
  "../images/bee-sprites/sprites/skeleton-animation_12.png",
];
bee.src = sprites[beeIndex];
let beeX = 100;
let beeY = 100;
let beeSize = 60;
let beeSpeed = 5;
let falling = true;

const pipeTop = new Image();
pipeTop.src = "../images/obstacle_top.png";
const pipeBottom = new Image();
pipeBottom.src = "../images/obstacle_bottom.png";

const pipeGap = 250;
const pipeWidth = 100;
const pipeHeight = 500;
let pipeSpeed = 5;
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
    score = 0;
    intervalId = 0;
    isGameOver = false;
    beeX = 50;
    beeY = 50;
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
  document.addEventListener("mousedown", () => {
    falling = false;
    handleFly();
  });

  function startGame() {
    gameScreen.style.display = "flex";

    //moving background, cycling through two backgrounds to appear to be moving
    ctx.drawImage(background, background1x, 0, canvas.width, canvas.height);
    ctx.drawImage(background2, background2x, 0, canvas.width, canvas.height);
    background1x -= beeSpeed;
    background2x -= beeSpeed;
    if (background1x < -canvas.width) background1x = canvas.width;
    if (background2x < -canvas.width) background2x = canvas.width;

    //drawing bee and cycling through sprites
    ctx.drawImage(bee, beeX, beeY, beeSize, beeSize);
    if (intervalId % 3 === 0) {
      for (let i = 0; i < sprites.length; i++) {
        if (beeIndex == 12) {
          beeIndex = 0;
        }
        beeIndex += 1;
        bee.src = sprites[beeIndex];
      }
    }

    //bee is always falling
    if (falling) {
      beeY += beeSpeed;
    } else {
      beeY -= beeSpeed + 2;
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
        currentPipe.x + pipeWidth <= beeX &&
        currentPipe.x + pipeWidth > beeX - pipeSpeed
      ) {
        score++;
        scoreElement.innerText = score;
      }

      //collisions with pipes
      if (
        //collision with top pipe
        (beeX + beeSize >= currentPipe.x &&
          beeY <= currentPipe.y + pipeHeight &&
          beeX <= currentPipe.x + pipeWidth) ||
        //collision with bottom pipe
        (beeX + beeSize >= currentPipe.x &&
          beeY + beeSize >= currentPipe.y + pipeHeight + pipeGap &&
          beeX <= currentPipe.x + pipeWidth)
      ) {
        isGameOver = true;
      }
    }

    //if bee touches bottom or top of canvas, game is over
    if (beeY < 0 || beeY + beeSize > canvas.height) isGameOver = true;

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
    gameOverScreen.style.display = "flex";
    gameScreen.style.display = "none";
    scoreElementGameOver.innerText = score;
  }

  function handleFly() {
    setTimeout(() => {
      falling = true;
    }, 150);
  }
};
