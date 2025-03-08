const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const maxCanvasSize = 400;
const canvasSize = Math.min(window.innerWidth - 40, maxCanvasSize);
canvas.width = canvasSize;
canvas.height = canvasSize; // Cuadrado
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

// Mensaje de carga
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

function drawGame() {
    // Mover serpiente
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verificar comida
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

    // Dibujar fondo
    if (canvasBackground.complete && canvasBackground.naturalWidth > 0) {
        ctx.drawImage(canvasBackground, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dibujar serpiente
    if (snakeHeadImage.complete && snakeHeadImage.naturalWidth > 0) {
        ctx.drawImage(snakeHeadImage, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    }
    snake.slice(1).forEach(segment => {
        if (snakeBodyImage.complete && snakeBodyImage.naturalWidth > 0) {
            ctx.drawImage(snakeBodyImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        } else {
            ctx.fillStyle = 'darkgreen';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });

    // Dibujar comida
    if (foodImage.complete && foodImage.naturalWidth > 0) {
        ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Verificar colisiones
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('Game Over! Tu puntación: ' + score);
        snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
        dx = 0;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
    }

    setTimeout(drawGame, 100);
}

// Controles con teclas (PC)
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

// Controles táctiles con deslizamiento (celular)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        if (deltaX > 0 && dx === 0) { dx = 1; dy = 0; } // Derecha
        else if (deltaX < 0 && dx === 0) { dx = -1; dy = 0; } // Izquierda
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
        if (deltaY > 0 && dy === 0) { dx = 0; dy = 1; } // Abajo
        else if (deltaY < 0 && dy === 0) { dx = 0; dy = -1; } // Arriba
    }

    // Reiniciar posición inicial para el próximo deslizamiento
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

// Cargar imágenes y empezar
const images = [snakeHeadImage, snakeBodyImage, foodImage, canvasBackground];
let loadedCount = 0;

function checkAllImagesLoaded() {
    loadedCount++;
    console.log(`Imagen cargada: ${loadedCount}/${images.length}`);
    if (loadedCount === images.length) {
        console.log('Todas las imágenes cargadas, iniciando juego...');
        drawGame();
    }
}

images.forEach(image => {
    if (image.complete && image.naturalWidth > 0) {
        checkAllImagesLoaded();
    } else {
        image.onload = () => {
            console.log(`Cargada: ${image.src}`);
            checkAllImagesLoaded();
        };
        image.onerror = () => {
            console.error(`Error cargando: ${image.src}`);
            checkAllImagesLoaded(); // Continúa aunque falle
        };
    }
});

// Iniciar después de 5 segundos si las imágenes no cargan
setTimeout(() => {
    if (loadedCount < images.length) {
        console.log('Timeout: iniciando juego sin todas las imágenes');
        drawGame();
    }
}, 5000);