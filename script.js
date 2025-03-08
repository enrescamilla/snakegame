const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
const scoreDisplay = document.getElementById('score');
const snakeHeadImage = document.getElementById('snakeHeadImage');
const snakeBodyImage = document.getElementById('snakeBodyImage');
const foodImage = document.getElementById('foodImage');
const canvasBackground = document.getElementById('canvasBackground');

function drawGame() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreDisplay.textContent = score;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }

    // Draw canvas background
    ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);

    // Draw snake: head first, then body
    ctx.drawImage(snakeHeadImage, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    snake.slice(1).forEach(segment => {
        ctx.drawImage(snakeBodyImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food with image
    ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('Game Over! Score: ' + score);
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
    }

    setTimeout(drawGame, 100); // Speed of the game
}

// Control snake with arrow keys
document.addEventListener('keydown', (event) => {
    switch (event.key) {
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
    }
});

// Start the game when all images are loaded
Promise.all([
    new Promise(resolve => snakeHeadImage.onload = resolve),
    new Promise(resolve => snakeBodyImage.onload = resolve),
    new Promise(resolve => foodImage.onload = resolve),
    new Promise(resolve => canvasBackground.onload = resolve)
]).then(() => drawGame());