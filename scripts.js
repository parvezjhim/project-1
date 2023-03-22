const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("height", getComputedStyle(canvas).height);
canvas.setAttribute("width", getComputedStyle(canvas).width);

const startScreen = document.getElementById("start-screen");
const youWonScreen = document.getElementById("you-won-screen");
const youLostScreen = document.getElementById("you-lost-screen");
const playAgainButton = document.querySelector("#play-again");
const instructionsButton = document.querySelector("#instructions-button");
const instructionsModal = document.querySelector("#instructions");
const closeInstructionsButton = document.querySelector("#close-button");

const openingCrawl = [
  "17 years ago, in a galaxy real, real close...",
  "Planet Earth has declassified Pluto as a planet...",
  "Unbeknownst to Earth, this made the Plutonians furious",
  "Hero: Why did I become a captain for the space force",
  "Should have joined the damn Nav...",
  "SUDDEN EXPLOSION",
  "GROUND SHAKES",
  "YOU HEAR WHAT SOUNDS LIKE THE VOICE OF GOD",
  "ATTENTION ALL HUMANS, SEVERAL YEARS AGO YOU DECLASSIFIED OUR HOME",
  "AS A PLANET, WE PLUTONIANS ARE HERE FOR OUR REVENGE!",
  "LET'S SEE IF EARTH IS STILL CONSIDERED A PLANET AFTER WE ARE DONE WITH IT!",
  "Your mission should you choose to accept it is",
  "As the Captain of the Space Force it is your job to defend the Earth",
  "You will be piloting the U.S.S Razor Crest which comes with a laser firing system",
  "You will need to defeat all enemy ships before you face the big boss",
  "Dodge their fire, and destroy their ships or all hope is lost",
  "Godspeed, Captain",
];

const openingCrawlSpeed = 2;
let openingCrawlY = canvas.height;

function renderOpeningCrawl() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "24px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  let y = openingCrawlY;
  for (let i = 0; i < openingCrawl.length; i++) {
    ctx.fillText(openingCrawl[i], canvas.width / 2, y);
    y += 30;
  }
  openingCrawlY -= openingCrawlSpeed;
  if (openingCrawlY < -canvas.height / 2) {
    clearInterval(intervalId);
    gameLoop();
  }
}

const heroShip = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
  direction: null,
  health: 3,
};

const enemyShipWidth = 50;
const enemyShipHeight = 50;
const enemyShipSpeed = 2;
const enemyShipHealth = 5;
const enemyShips = [];

const bossShip = {
  x: canvas.width / 2 - 100,
  y: -200,
  width: 200,
  height: 200,
  speed: 4,
  direction: "down",
  health: 50,
};

let bullets = [];
let gameIsOver = false;
let enemiesAreMovingDown = false;
let frames = 0;
let score = 0;
let gameStarted = false;
let intervalId = null;

function startGame() {
  gameStarted = true;
  startScreen.style.display = "none";
  spawnEnemyShips();
}

function spawnEnemyShips() {
  const numCols = Math.floor(canvas.width / enemyShipWidth);
  const numRows = 4;
  for (let i = 0; i < numCols * numRows; i++) {
    const x = (i % numCols) * enemyShipWidth;
    const y = Math.floor(i / numCols) * enemyShipHeight;
    enemyShips.push({
      x,
      y,
      width: enemyShipWidth,
      height: enemyShipHeight,
      health: enemyShipHealth
    });
  }
}

function handleInput(event) {
  if (event.key === "a") {
    heroShip.direction = "left";
  } else if (event.key === "d") {
    heroShip.direction = "right";
  } else if (event.key === " ") {
    bullets.push({
      x: heroShip.x + heroShip.width / 2,
      y: heroShip.y,
      width: 5,
      height: 10,
      direction: "up",
      speed: 5,
    });
  }
}

function updateHeroShip() {
  if (heroShip.direction === "left" && heroShip.x > 0) {
    heroShip.x -= 5;
  } else if (
    heroShip.direction === "right" &&
    heroShip.x + heroShip.width < canvas.width
  ) {
    heroShip.x += 5;
  }
}

function updateEnemyShips() {
  for (let i = 0; i < enemyShips.length; i++) {
    const enemyShip = enemyShips[i];

    enemyShip.x += enemyShipSpeed;
    if (
      enemyShip.x + enemyShipWidth > canvas.width ||
      enemyShip.x < 0
    ) {
      enemiesAreMovingDown = true;
    }
    if (Math.random() < 0.01) {
      bullets.push({
        x: enemyShip.x + enemyShip.width / 2,
        y: enemyShip.y + enemyShip.height,
        width: 5,
        height: 10,
        direction: "down",
        speed: 5,
      });
    }
  }
  if (enemiesAreMovingDown) {
    for (let i = 0; i < enemyShips.length; i++) {
      const enemyShip = enemyShips[i];
      enemyShip.x += enemyShipSpeed * enemyShip.direction;
      if (enemyShip.x <= 0 || enemyShip.x + enemyShipWidth >= canvas.width) {
        enemyShip.direction *= -1;
      }
      if (frames % 60 === 0) {
        const bullet = {
          x: enemyShip.x + enemyShipWidth / 2,
          y: enemyShip.y + enemyShipHeight,
          width: 5,
          height: 10,
          speed: 5,
        };
        bullets.push(bullet);
      }
    }
  }
  
  function gameLoop() {
    if (!gameStarted) {
      renderStartScreen();
      return;
    }
    if (gameIsOver) {
      clearInterval(intervalId);
      if (score === enemyShips.length * enemyShipHealth) {
        renderYouWonScreen();
      } else {
        renderYouLostScreen();
      }
      return;
    }
  
    frames++;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    handleHeroShipMovement();
    renderHeroShip();
  
    handleBullets();
    handleEnemyShips();
  
    if (enemyShips.length === 0) {
      renderBossShip();
    } else {
      renderEnemyShips();
    }
  
    renderScore();
  
    if (bossShip.health <= 0) {
      gameIsOver = true;
      renderYouWonScreen();
      return;
    }
  
    if (heroShip.health <= 0) {
      gameIsOver = true;
      renderYouLostScreen();
      return;
    }
  
    requestAnimationFrame(gameLoop);
  }
  
  function handleBossShip() {
    bossShip.x += bossShip.speed * bossShip.direction;
    if (bossShip.x <= 0 || bossShip.x + bossShip.width >= canvas.width) {
      bossShip.direction *= -1;
    }
    if (frames % 60 === 0) {
      const bullet = {
        x: bossShip.x + bossShip.width / 2,
        y: bossShip.y + bossShip.height,
        width: 5,
        height: 20,
        speed: 5,
        direction: 1,
      };
      enemyBullets.push(bullet);
    }
    for (let i = 0; i < enemyBullets.length; i++) {
      const bullet = enemyBullets[i];
      bullet.y += bullet.speed * bullet.direction;
      if (bullet.y + bullet.height >= canvas.height) {
        enemyBullets.splice(i, 1);
        i--;
      } else {
        if (
          bullet.x + bullet.width >= player.x &&
          bullet.x <= player.x + player.width &&
          bullet.y + bullet.height >= player.y &&
          bullet.y <= player.y + player.height
        ) {
          gameOver();
          break;
        }
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }
    }
  }
  
           
  

 
