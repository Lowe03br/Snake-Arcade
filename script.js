const bgMusic = document.getElementById("background-music");
const boardSize = 20;
const board = document.getElementById('game-board');
const cells = [];
let snake = [];
let direction = 1;
let nextDirection = 1;
let food = 0;
let interval = 200;
let game;
let score = 0;
let snakeColor = "limegreen";
let startTime;
let timerInterval;
let isGameOver = false;
let isPaused = false;
let currentSkin = null;

const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("gameover-sound");

// Criar tabuleiro
for (let i = 0; i < boardSize * boardSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  board.appendChild(cell);
  cells.push(cell);
}

function drawSnake() {
  cells.forEach(c => {
    c.classList.remove('snake');
    c.style.backgroundColor = "";
    c.style.backgroundImage = "";
    c.style.animation = "";
    c.style.boxShadow = "";
  });

  snake.forEach(i => {
    if (cells[i]) {
      cells[i].classList.add('snake');
      
      if (currentSkin) {
        cells[i].style.backgroundImage = `url('${currentSkin}')`;
        cells[i].style.backgroundSize = 'cover';
        cells[i].style.backgroundRepeat = 'no-repeat';
      } else {
        cells[i].style.backgroundColor = snakeColor;
        cells[i].style.boxShadow = `0 0 6px ${snakeColor}`;
        cells[i].style.animation = "snakeGlow 1s infinite";
      }
    }
  });
}

function drawFood() {
  cells.forEach(c => c.classList.remove('food'));
  cells[food].classList.add('food');
}

function randomFood() {
  let pos;
  do {
    pos = Math.floor(Math.random() * cells.length);
  } while (snake.includes(pos));
  food = pos;
  drawFood();
}

function move() {
  direction = nextDirection;
  const head = snake[0];
  let newHead = head + direction;

  const headX = head % boardSize;
  const headY = Math.floor(head / boardSize);
  const newX = newHead % boardSize;
  const newY = Math.floor(newHead / boardSize);

  // Colisão com paredes ou corpo
  if (
    newX < 0 || newX >= boardSize ||
    newY < 0 || newY >= boardSize ||
    (direction === 1 && newY !== headY) ||
    (direction === -1 && newY !== headY) ||
    snake.includes(newHead)
  ) {
    return gameOver();
  }

  snake.unshift(newHead);

  if (newHead === food) {
    score++;
    updateScore();
    eatSound.play();
    randomFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function gameOver() {
  clearInterval(game);
  clearInterval(timerInterval);
  gameOverSound.play();
  bgMusic.pause();
  bgMusic.currentTime = 0;
  isGameOver = true; // <- adiciona isso aqui

  const endTime = Date.now();
  const totalSeconds = Math.floor((endTime - startTime) / 1000);

  document.getElementById("final-score").innerText = "Pontuação final: " + score;
  document.getElementById("final-time").innerText = "Tempo de jogo: " + totalSeconds + " segundos";

  document.getElementById("gameover-popup").classList.remove("hidden");
}

function restartGame() {
  location.reload();
}

function updateScore() {
  document.getElementById("score").innerText = "Pontuação: " + score;
}

function control(e) {
  const key = e.key;
  if (key === 'w' && direction !== boardSize) nextDirection = -boardSize;
  else if (key === 's' && direction !== -boardSize) nextDirection = boardSize;
  else if (key === 'a' && direction !== 1) nextDirection = -1;
  else if (key === 'd' && direction !== -1) nextDirection = 1;
}

document.addEventListener('keydown', control);

// Controles para mobile
function moveUp() {
  if (direction !== boardSize) nextDirection = -boardSize;
}
function moveDown() {
  if (direction !== -boardSize) nextDirection = boardSize;
}
function moveLeft() {
  if (direction !== 1) nextDirection = -1;
}
function moveRight() {
  if (direction !== -1) nextDirection = 1;
}

// Iniciar o jogo
function startGame() {
  bgMusic.currentTime = 0;
  bgMusic.volume = 0.3;
  bgMusic.play();  
  document.getElementById("menu").style.display = "none";
  document.getElementById("game-area").style.display = "flex";

  snakeColor = document.getElementById("color").value;

  const skinValue = document.getElementById("skin").value;
  currentSkin = skinValue === "none" ? null : skinValue;

  score = 0;
  updateScore();

  const start = Math.floor(boardSize / 2) * boardSize + 5;
  snake = [start, start - 1, start - 2];
  direction = 1;
  nextDirection = 1;

  drawSnake();
  randomFood();

  startTime = Date.now();
  timerInterval = setInterval(() => {
    const now = Date.now();
    const totalSeconds = Math.floor((now - startTime) / 1000);
    document.getElementById("time").innerText = `Tempo: ${totalSeconds}s`;
  }, 1000);

  game = setInterval(move, interval);
  const theme = document.getElementById("theme").value;

if (theme === "light") {
  document.body.classList.add("light-mode");
  board.classList.add("light-mode");
  cells.forEach(c => c.classList.add("light-mode"));
} else {
  document.body.classList.remove("light-mode");
  board.classList.remove("light-mode");
  cells.forEach(c => c.classList.remove("light-mode"));
}

}

// Som de clique
function playClickSound() {
  const click = document.getElementById("click-sound");
  click.currentTime = 0;
  click.play();
}

function pauseGame() {
  clearInterval(game);
  clearInterval(timerInterval);
  bgMusic.pause();
  isPaused = true;
  document.getElementById("pause-overlay").classList.remove("hidden");
}

function resumeGame() {
  document.getElementById("pause-overlay").classList.add("hidden");
  isPaused = false;
  bgMusic.play();

  timerInterval = setInterval(() => {
    const now = Date.now();
    const totalSeconds = Math.floor((now - startTime) / 1000);
    document.getElementById("time").innerText = `Tempo: ${totalSeconds}s`;
  }, 1000);

  game = setInterval(move, interval);
}

document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    if (isGameOver) return; // Não faz nada se o jogo acabou

    if (!isPaused) {
      pauseGame();
    } else {
      resumeGame();
    }
  }
});


function changeMusicVolume(amount) {
  const bgMusic = document.getElementById("background-music");
  bgMusic.volume = Math.min(1, Math.max(0, bgMusic.volume + amount));
}

function changeEffectsVolume(amount) {
  const effectSounds = [
    document.getElementById("eat-sound"),
    document.getElementById("gameover-sound"),
    document.getElementById("click-sound"),
  ];

  effectSounds.forEach(sound => {
    sound.volume = Math.min(1, Math.max(0, sound.volume + amount));
  });
}

function simulateKey(key) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

document.getElementById("up").addEventListener("click", () => simulateKey("ArrowUp"));
document.getElementById("down").addEventListener("click", () => simulateKey("ArrowDown"));
document.getElementById("left").addEventListener("click", () => simulateKey("ArrowLeft"));
document.getElementById("right").addEventListener("click", () => simulateKey("ArrowRight"));

let joystick = document.getElementById('joystick');
let container = document.getElementById('joystick-container');
let containerRect = container.getBoundingClientRect();
let centerX = containerRect.left + container.offsetWidth / 2;
let centerY = containerRect.top + container.offsetHeight / 2;

let startX = 0;
let startY = 0;

container.addEventListener('touchstart', function (e) {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}, false);

container.addEventListener('touchmove', function (e) {
  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;
  const angle = Math.atan2(dy, dx);
  const distance = Math.min(30, Math.sqrt(dx * dx + dy * dy));

  // Move o joystick visualmente
  joystick.style.transform = `translate(${dx}px, ${dy}px)`;

  // Detecta direção
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 10 && direction !== -1) nextDirection = 1;       // direita
    else if (dx < -10 && direction !== 1) nextDirection = -1; // esquerda
  } else {
    if (dy > 10 && direction !== -boardSize) nextDirection = boardSize;       // baixo
    else if (dy < -10 && direction !== boardSize) nextDirection = -boardSize; // cima
  }

}, false);

container.addEventListener('touchend', function () {
  joystick.style.transform = `translate(0, 0)`; // reseta visualmente
}, false);

function createGhostSnakes() {
  const container = document.getElementById("ghost-snakes");
  if (!container) return;

  for (let i = 0; i < 10; i++) {
    const ghost = document.createElement("div");
    ghost.classList.add("ghost-snake");

    ghost.style.top = `${Math.random() * 100}vh`;
    ghost.style.width = `${40 + Math.random() * 60}px`;
    ghost.style.animationDuration = `${6 + Math.random() * 6}s`;
    ghost.style.animationDelay = `-${Math.random() * 6}s`;

    container.appendChild(ghost);
  }
}

const btnPause = document.getElementById("btn-pause");
btnPause.addEventListener("click", () => {
  if (isGameOver) return; // Não faz nada se o jogo acabou

  if (!isPaused) {
    pauseGame();
    btnPause.innerText = "Continuar";
  } else {
    resumeGame();
    btnPause.innerText = "Pausar";
  }
});

// Salvar recordes no localStorage
const bestScore = localStorage.getItem("bestScore") || 0;
const bestTime = localStorage.getItem("bestTime") || 0;

if (score > bestScore) {
  localStorage.setItem("bestScore", score);
}

if (totalSeconds > bestTime) {
  localStorage.setItem("bestTime", totalSeconds);
}

const btnRanking = document.getElementById("btn-ranking");
const rankingPopup = document.getElementById("ranking-popup");
const closeRanking = document.getElementById("close-ranking");

btnRanking.addEventListener("click", () => {
  const bestScore = localStorage.getItem("bestScore") || 0;
  const bestTime = localStorage.getItem("bestTime") || 0;

  // Converte segundos para h:m:s
  const hours = Math.floor(bestTime / 3600);
  const minutes = Math.floor((bestTime % 3600) / 60);
  const seconds = bestTime % 60;

  let timeStr = "";
  if (hours > 0) timeStr += `${hours}h `;
  if (minutes > 0 || hours > 0) timeStr += `${minutes}m `;
  timeStr += `${seconds}s`;

  document.getElementById("best-score-record").innerText = `Maior Pontuação: ${bestScore}`;
  document.getElementById("best-time-record").innerText = `Maior Tempo: ${timeStr}`;

  rankingPopup.classList.remove("hidden");
});

closeRanking.addEventListener("click", () => {
  rankingPopup.classList.add("hidden");
});