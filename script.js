const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let canvasSize = Math.min(window.innerWidth - 40, 400); // Máximo 400px o ancho de pantalla menos márgenes
canvas.width = canvasSize;
canvas.height = canvasSize;
const tileCount = canvas.width / gridSize;
let snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
let food = { x: Math.floor(tileCount * 0.75), y: Math.floor(tileCount * 0.75) };
let dx = 0;
let dy = 0;
let score = 0;
const scoreDisplay = document.getElementById('score');
const snakeHeadImage = document.getElementById('snakeHeadImage');
const snakeBodyImage = document.getElementById('snakeBodyImage');
const foodImage = document.getElementById('foodImage');
const canvasBackground = document.getElementById('canvasBackground');

// Mostrar mensaje de carga
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

function drawGame() {
    // Mover serpiente
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verificar si comió comida
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

    // Dibujar fondo del canvas
    ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);

    // Dibujar serpiente: cabeza primero, luego cuerpo
    ctx.drawImage(snakeHeadImage, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    snake.slice(1).forEach(segment => {
        ctx.drawImage(snakeBodyImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Dibujar comida
    ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Verificar colisiones
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('Game Over! Score: ' + score);
        snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
    }

    setTimeout(drawGame, 100); // Velocidad del juego
}

// Controles con teclas
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

// Controles con botones táctiles
document.getElementById('up').addEventListener('click', () => {
    if (dy === 0) { dx = 0; dy = -1; }
});
document.getElementById('down').addEventListener('click', () => {
    if (dy === 0) { dx = 0; dy = 1; }
});
document.getElementById('left').addEventListener('click', () => {
    if (dx === 0) { dx = -1; dy = 0; }
});
document.getElementById('right').addEventListener('click', () => {
    if (dx === 0) { dx = 1; dy = 0; }
});

// Esperar a que carguen las imágenes
const images = [snakeHeadImage, snakeBodyImage, foodImage, canvasBackground];
let loadedCount = 0;

function checkAllImagesLoaded() {
    loadedCount++;
    if (loadedCount === images.length) {
        drawGame(); // Iniciar el juego cuando todas las imágenes estén cargadas
    }
}

images.forEach(image => {
    if (image.complete && image.naturalWidth !== 0) {
        checkAllImagesLoaded();
    } else {
        image.onload = checkAllImagesLoaded;
        image.onerror = () => {
            console.error(`Failed to load image: ${image.src}`);
            checkAllImagesLoaded();
        };
    }
});