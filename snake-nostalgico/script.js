const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("pontos");
const recordElement = document.getElementById("recorde");
const screen = document.getElementById("screen");

const box = 15;

let snake, food, direction, game, score, speed;
let started = false;
let paused = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;

// RESET
function resetGame() {
    snake = [
        { x: 10 * box, y: 10 * box },
        { x: 9 * box, y: 10 * box },
        { x: 8 * box, y: 10 * box }
    ];

    food = randomFood();
    direction = null;
    score = 0;
    speed = 120;
    started = false;
    paused = false;

    scoreElement.innerHTML = "0000";
    recordElement.innerHTML = "HI: " + highScore.toString().padStart(4, "0");

    if (game) clearInterval(game);
    drawStartScreen();
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// CONTROLES
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key === "Enter") return resetGame();

    if (key.toLowerCase() === "p") {
        paused = !paused;
        return;
    }

    const map = {
        ArrowLeft: "LEFT",
        ArrowUp: "UP",
        ArrowRight: "RIGHT",
        ArrowDown: "DOWN"
    };

    if (map[key]) {
        const newDir = map[key];

        if (
            (direction === "LEFT" && newDir === "RIGHT") ||
            (direction === "RIGHT" && newDir === "LEFT") ||
            (direction === "UP" && newDir === "DOWN") ||
            (direction === "DOWN" && newDir === "UP")
        ) return;

        direction = newDir;

        if (!started) {
            started = true;
            game = setInterval(draw, speed);
        }
    }
});

// DESENHAR COBRA (com olhos)
function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = "#0f380f";
        ctx.fillRect(part.x, part.y, box - 1, box - 1);

        // cabeça com olhos
        if (index === 0) {
            drawEyes(part.x, part.y);
        }
    });
}

// DESENHAR OLHOS
function drawEyes(x, y) {
    ctx.fillStyle = "#8bac0f";

    let offset = 3;
    let size = 2;

    if (direction === "RIGHT") {
        ctx.fillRect(x + box - offset - size, y + offset, size, size);
        ctx.fillRect(x + box - offset - size, y + box - offset - size, size, size);
    }

    else if (direction === "LEFT") {
        ctx.fillRect(x + offset, y + offset, size, size);
        ctx.fillRect(x + offset, y + box - offset - size, size, size);
    }

    else if (direction === "UP") {
        ctx.fillRect(x + offset, y + offset, size, size);
        ctx.fillRect(x + box - offset - size, y + offset, size, size);
    }

    else if (direction === "DOWN") {
        ctx.fillRect(x + offset, y + box - offset - size, size, size);
        ctx.fillRect(x + box - offset - size, y + box - offset - size, size, size);
    }
}

// LOOP
function draw() {
    if (paused) return;

    ctx.fillStyle = "#8bac0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();

    ctx.fillStyle = "#0f380f";
    ctx.fillRect(food.x, food.y, box - 1, box - 1);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        scoreElement.innerHTML = score.toString().padStart(4, "0");

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            recordElement.innerHTML = "HI: " + highScore.toString().padStart(4, "0");
            flashScreen();
        }

        food = randomFood();

        if (speed > 60) {
            speed -= 2;
            clearInterval(game);
            game = setInterval(draw, speed);
        }

    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, body) {
    return body.some(p => p.x === head.x && p.y === head.y);
}

function flashScreen() {
    screen.classList.remove("flash");
    void screen.offsetWidth;
    screen.classList.add("flash");
}

function gameOver() {
    clearInterval(game);

    ctx.fillStyle = "#8bac0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f380f";
    ctx.font = "16px Courier New";
    ctx.textAlign = "center";

    ctx.fillText("GAME OVER", canvas.width / 2, 140);
    ctx.fillText("ENTER = REINICIAR", canvas.width / 2, 170);
}

function drawStartScreen() {
    ctx.fillStyle = "#8bac0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f380f";
    ctx.font = "16px Courier New";
    ctx.textAlign = "center";

    ctx.fillText("SNAKE RETRO", canvas.width / 2, 130);
    ctx.fillText("APERTE UMA SETA", canvas.width / 2, 160);
}

// INIT
resetGame();