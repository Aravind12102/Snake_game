var gameStart = null,
    scoreBoard = null,
    gameArea = null,
    gameAreaContext = null,
    gameAreaWidth = 600,
    gameAreaHeight = 400,
    cellWidth = 20,
    playerScore = 0,
    snake = null,
    snakeFood = null,
    specialFood = null,
    snakeDirection = null,
    initialSpeedSize = 10,
    speedSize = initialSpeedSize,
    timer = null,
    specialFoodTimer = null,
    fruitCount = 0;

function initialize() {
    gameStart = document.getElementById('gameStart');
    scoreBoard = document.getElementById('scoreBoard');
    gameArea = document.getElementById('gameArea');
    gameAreaContext = gameArea.getContext('2d');
    gameArea.width = gameAreaWidth;
    gameArea.height = gameAreaHeight;

    gameStart.addEventListener('click', function() {
        this.disabled = true;
        startGame();
    });
}

function startGame() {
    playerScore = 0;
    speedSize = initialSpeedSize;
    fruitCount = 0;
    snake = [{ x: 5, y: 5 }];
    snakeDirection = 'right';
    specialFood = null;
    createFood();
    clearInterval(timer);
    timer = setInterval(createGameArea, 1000 / speedSize);
    updateScoreBoard();
}

function createGameArea() {
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;
    snakeDirection === 'right' ? snakeX++ : snakeDirection === 'left' ? snakeX-- : snakeDirection === 'up' ? snakeY-- : snakeY++;

    snakeX = (snakeX + gameAreaWidth / cellWidth) % (gameAreaWidth / cellWidth);
    snakeY = (snakeY + gameAreaHeight / cellWidth) % (gameAreaHeight / cellWidth);

    if (snake.some((segment, index) => index !== 0 && segment.x === snakeX && segment.y === snakeY)) {
        endGame();
        return;
    }

    updateSnake(snakeX, snakeY);
    drawGameArea();
}

function updateSnake(snakeX, snakeY) {
    let head = { x: snakeX, y: snakeY };
    let ateFood = head.x === snakeFood.x && head.y === snakeFood.y;
    let ateSpecialFood = specialFood && head.x === specialFood.x && head.y === specialFood.y;

    if (ateFood) {
        playerScore++;
        // Increase speed by 10%, cap at 3 times the initial speed size
        if (speedSize < initialSpeedSize * 3) {
            speedSize *= 1.1;
        }
        snake.unshift(head); // Add new head
        createFood(); // Immediately create next food
    } else if (ateSpecialFood) {
        playerScore += 2;
        // Increase speed by 20%, cap at 4 times the initial speed size for more challenge
        if (speedSize < initialSpeedSize * 4) {
            speedSize *= 1.2;
        }
        snake.unshift(head); // Add new head
        clearTimeout(specialFoodTimer); // Clear any existing special food timer
        specialFood = null; // Remove special food immediately
        createFood(); // Create new food right away
    } else {
        snake.pop(); // Remove tail if no food eaten
        snake.unshift(head); // Move head forward
    }
    updateScoreBoard();
}




function createFood() {
    fruitCount++;
    // Check if it's time for special food
    if (fruitCount % 5 === 0 && !specialFood) { // Ensure no overlap/conflict
        specialFood = {
            x: Math.floor(Math.random() * (gameAreaWidth / cellWidth)),
            y: Math.floor(Math.random() * (gameAreaHeight / cellWidth))
        };
        startSpecialFoodTimer();
    } else if (!specialFood) { // Only create red food if there's no special food active
        snakeFood = {
            x: Math.floor(Math.random() * (gameAreaWidth / cellWidth)),
            y: Math.floor(Math.random() * (gameAreaHeight / cellWidth))
        };
    }
}


function drawGameArea() {
    gameAreaContext.clearRect(0, 0, gameAreaWidth, gameAreaHeight);
    snake.forEach((segment, index) => {
        gameAreaContext.beginPath();
        gameAreaContext.arc(segment.x * cellWidth + cellWidth / 2, segment.y * cellWidth + cellWidth / 2, cellWidth / 2, 0, 2 * Math.PI);
        gameAreaContext.fillStyle = index === 0 ? "darkgreen" : "green";
        gameAreaContext.fill();
    });

    if (!specialFood || fruitCount % 5 !== 0) {
        gameAreaContext.beginPath();
        gameAreaContext.arc(snakeFood.x * cellWidth + cellWidth / 2, snakeFood.y * cellWidth + cellWidth / 2, cellWidth / 2, 0, 2 * Math.PI);
        gameAreaContext.fillStyle = "red";
        gameAreaContext.fill();
    }

    if (specialFood) {
        gameAreaContext.beginPath();
        gameAreaContext.moveTo(specialFood.x * cellWidth + cellWidth / 2, specialFood.y * cellWidth);
        gameAreaContext.lineTo(specialFood.x * cellWidth, specialFood.y * cellWidth + cellWidth);
        gameAreaContext.lineTo(specialFood.x * cellWidth + cellWidth, specialFood.y * cellWidth + cellWidth);
        gameAreaContext.closePath();
        gameAreaContext.fillStyle = 'purple';
        gameAreaContext.fill();
    }
}

function startSpecialFoodTimer() {
    clearInterval(specialFoodTimer);
    specialFoodTimer = setTimeout(() => {
        specialFood = null;
        createFood();
    }, 5000);
}

function updateScoreBoard() {
    document.getElementById("currentScore").textContent = playerScore;
}

function endGame() {
    clearInterval(timer);
    gameStart.disabled = false;
    alert('Game Over! Your score was: ' + playerScore);
}

window.addEventListener('keydown', function(e) {
    const direction = e.key.replace('Arrow', '').toLowerCase();
    if (direction === 'up' && snakeDirection !== 'down') {
        snakeDirection = 'up';
    } else if (direction === 'down' && snakeDirection !== 'up') {
        snakeDirection = 'down';
    } else if (direction === 'left' && snakeDirection !== 'right') {
        snakeDirection = 'left';
    } else if (direction === 'right' && snakeDirection !== 'left') {
        snakeDirection = 'right';
    }
});

document.addEventListener('DOMContentLoaded', initialize);
