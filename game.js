// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Game state
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop;

// Initialize
highScoreDisplay.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyPress);

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
        gameLoop = setInterval(update, 100);
    }
}

// Toggle pause
function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        
        if (!gamePaused) {
            gameLoop = setInterval(update, 100);
        } else {
            clearInterval(gameLoop);
        }
    }
}

// Restart game
function restartGame() {
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    direction = {x: 1, y: 0};
    nextDirection = {x: 1, y: 0};
    score = 0;
    scoreDisplay.textContent = score;
    gameRunning = false;
    gamePaused = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    generateFood();
    draw();
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    
    // Arrow keys
    if (event.key === 'ArrowUp' || key === 'w') {
        if (direction.y === 0) nextDirection = {x: 0, y: -1};
    }
    if (event.key === 'ArrowDown' || key === 's') {
        if (direction.y === 0) nextDirection = {x: 0, y: 1};
    }
    if (event.key === 'ArrowLeft' || key === 'a') {
        if (direction.x === 0) nextDirection = {x: -1, y: 0};
    }
    if (event.key === 'ArrowRight' || key === 'd') {
        if (direction.x === 0) nextDirection = {x: 1, y: 0};
    }
}

// Update game state
function update() {
    if (!gameRunning || gamePaused) return;
    
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = snake[0];
    const newHead = {
        x: (head.x + direction.x + TILE_COUNT) % TILE_COUNT,
        y: (head.y + direction.y + TILE_COUNT) % TILE_COUNT
    };
    
    // Check if snake hit itself
    for (let segment of snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    draw();
}

// Generate food at random position
function generateFood() {
    let newFood;
    let collision;
    
    do {
        collision = false;
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        
        // Check if food overlaps with snake
        for (let segment of snake) {
            if (newFood.x === segment.x && newFood.y === segment.y) {
                collision = true;
                break;
            }
        }
    } while (collision);
    
    food = newFood;
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    gamePaused = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
    
    // Show game over message
    alert(`Game Over! Score: ${score}\nHigh Score: ${highScore}`);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        ctx.fillRect(
            segment.x * GRID_SIZE + 1,
            segment.y * GRID_SIZE + 1,
            GRID_SIZE - 2,
            GRID_SIZE - 2
        );
    }
    
    // Draw head with different color
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(
        snake[0].x * GRID_SIZE + 1,
        snake[0].y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
    );
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Initial draw
generate Food();
draw();