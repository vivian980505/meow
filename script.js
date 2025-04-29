const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start");
const scoreDisplay = document.getElementById("score");

// 讓 canvas 根據視窗大小調整
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8; // 80% 螢幕寬度
  canvas.height = window.innerHeight * 0.8; // 80% 螢幕高度
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // 初始調整

const gridSize = 20;
const tileCountX = Math.floor(canvas.width / gridSize);
const tileCountY = Math.floor(canvas.height / gridSize);

let snake, dx, dy, food, timer;
let score = 0;
let foodType = '';

startBtn.addEventListener("click", () => {
  canvas.style.display = "block";
  startBtn.style.display = "none";
  startGame();
});

function startGame() {
  snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }];
  dx = 1;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = score;
  food = randomFood();
  foodType = food.type;
  clearInterval(timer);
  timer = setInterval(update, 200);
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= tileCountX ||
    head.y < 0 || head.y >= tileCountY ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(timer);
    alert("☠ 遊戲結束！!! 分數: " + score);
    startBtn.textContent = "再試一次";
    startBtn.style.display = "inline-block";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += getFoodScore(foodType);
    scoreDisplay.textContent = score;
    food = randomFood();
    foodType = food.type;
  } else {
    snake.pop();
  }

  draw();
}

function randomFood() {
  const types = ['🍩', '🍨', '🍰', '🍓'];
  const probabilities = [0.35, 0.30, 0.20, 0.15];
  let rand = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < types.length; i++) {
    cumulativeProbability += probabilities[i];
    if (rand <= cumulativeProbability) {
      return {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
        type: types[i]
      };
    }
  }

  return { x: 10, y: 10, type: '🍩' };
}

function getFoodScore(type) {
  switch (type) {
    case '🍩': return 3;
    case '🍨': return 5;
    case '🍰': return 7;
    case '🍓': return 15;
    default: return 0;
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${gridSize - 2}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "white" : "hotpink";
    ctx.fillText(i === 0 ? "🐹" : "💗",
      snake[i].x * gridSize + gridSize / 2,
      snake[i].y * gridSize + gridSize / 2);
  }

  ctx.fillStyle = "red";
  ctx.fillText(food.type,
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  else if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});
