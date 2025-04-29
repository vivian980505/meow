<canvas id="gameCanvas" width="400" height="400"></canvas>

<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }]; // 蛇從中間開始
  let dx = 1;
  let dy = 0;
  let food = randomPosition();
  let gameOver = false;
  let score = 0;
  let speed = 150;
  let timer = null;

  function startGame() {
    clearTimeout(timer);
    gameOver = false;
    score = 0;
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }]; // 重設蛇的位置
    timer = setTimeout(gameLoop, speed);
  }

  function gameLoop() {
    if (gameOver) return;

    moveSnake();

    if (checkCollision()) {
      alert("遊戲結束！分數：" + score);
      gameOver = true;
      return;
    }

    if (eatFood()) {
      snake.push({});
      food = randomPosition();
      score += 1;
    }

    drawGame();
    timer = setTimeout(gameLoop, speed);
  }

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
  }

  function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      return true;
    }
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
  }

  function eatFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
  }

  function randomPosition() {
    return {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }

  function drawGame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 畫蛇
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }

    // 畫食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 顯示分數（左上角）
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`分數：${score}`, 10, 25);
  }

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        if (dy === 0) { dx = 0; dy = -1; }
        break;
      case 'ArrowDown':
        if (dy === 0) { dx = 0; dy = 1; }
        break;
      case 'ArrowLeft':
        if (dx === 0) { dx = -1; dy = 0; }
        break;
      case 'ArrowRight':
        if (dx === 0) { dx = 1; dy = 0; }
        break;
      case 'Shift':
        if (!gameOver && speed === 150) {
          speed = 75; // 加速
        }
        break;
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'Shift') {
      if (!gameOver && speed === 75) {
        speed = 150; // 恢復正常速度
      }
    }
  });

  startGame();
</script>
