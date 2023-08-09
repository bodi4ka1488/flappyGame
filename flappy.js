let bird = new Image();
bird.src = "img/bird.png";
let birdX = 0;
let birdY = 200;

let pipeUp = new Image();
pipeUp.src = "img/pipeUp.png";

let pipeBottom = new Image();
pipeBottom.src = "img/pipeBottom.png";

let road = new Image();
road.src = "img/road.png";

let fon = new Image();
fon.src = "img/back.png";

let audioFly = new Audio();
audioFly.src = "audio/fly.mp3";

let audioScore = new Audio();
audioScore.src = "audio/score.mp3";

let canva = document.getElementById("canvas");
const canvaWidth = 256;
const canvaHeight = 512;
canva.width = canvaWidth;
canva.height = canvaHeight;
const ctx = canva.getContext("2d");

let yPos = 200;
let velY = 1;
let gravity = 0.3;

let pipe = [
  {
    x: canva.width,
    y1: 0,
    y2: 350,
  },
];
let score = 0;
let scoreText = document.getElementById("score");
let bestScore = 0;
let bestScoreText = document.getElementById("bestScore");
scoreText.textContent = score;
bestScoreText.textContent = bestScore;

let intervalId;
let isPaused = false;
let buttonPause = document.getElementById("pause");

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    // Відобразити прозорий прямокутник під час паузи
    audioFly.muted = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canva.width, canva.height);
    stopInterval();
  } else {
    audioFly.muted = false;
    ctx.clearRect(0, 0, canva.width, canva.height);
    resumeInterval();
  }
}
function startInterval() {
  intervalId = setInterval(draw, 20);
}

function stopInterval() {
  clearInterval(intervalId);
}

function resumeInterval() {
  startInterval();
}
function reload() {
  yPos = 246;
  velY = 1;
  gravity = 0.3;
  pipe = [
    {
      x: canva.width,
      y1: 0,
      y2: 350,
    },
  ];

  score = 0;
  scoreText.textContent = score;
  bestScoreText.textContent = bestScore;
}
function draw() {
  let rand = Math.floor(Math.random() * (-200 - 0 + 1)) + 0;
  ctx.drawImage(fon, 0, 0, canva.width, canva.height);
  ctx.drawImage(road, 0, canvaHeight - 100);
  ctx.drawImage(bird, birdX, yPos);
  for (let i = 0; i < pipe.length; i++) {
    pipe[i].x -= 4;
    if (pipe[i].x == 80) {
      pipe.push({
        x: canva.width,
        y1: rand,
        y2: rand + 350,
      });
    }
    if (yPos < pipeUp.height + pipe[0].y1 && pipe[i].x == birdX) {
      score = 0;
      reload();
    }
    if (yPos > pipe[0].y2 + pipeBottom.height - 400 && pipe[i].x == birdX) {
      score = 0;
      reload();
    }
    if (
      yPos > pipeUp.height + pipe[0].y1 &&
      pipe[i].x == birdX &&
      yPos < (pipe[0].y2 + pipeBottom.height) / 2.1 &&
      pipe[i].x == birdX
    ) {
      audioScore.play();
      score += 1;
      if (score > bestScore) {
        bestScore = score;
      }
      scoreText.textContent = score;
    }

    pipe[i].x <= -30 ? pipe.shift() : null;
    ctx.drawImage(pipeUp, pipe[i].x - 10, pipe[i].y1);
    ctx.drawImage(pipeBottom, pipe[i].x - 10, pipe[i].y2);
  }
  bird.style.top = yPos + "px";
  velY = velY + gravity;
  yPos = yPos + velY;
  if (yPos > canva.height - 100) {
    reload();
  }
}
canva.addEventListener("mousedown", function (event) {
  velY = -4;
  audioFly.play();
});
document.addEventListener("keydown", (event) => {
  if (event.keyCode === 32) {
    togglePause();
  }
});
startInterval();
