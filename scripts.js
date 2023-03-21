const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
canvas.setAttribute("height", getComputedStyle(canvas).height)
canvas.setAttribute("width", getComputedStyle(canvas.width))

const startScreen = document.getElementById("start-screen")
const youWonScreen = document.getElementById("you-won-screen")
const playAgainButton = document.querySelector("#play-again")
const instructionsButton = document.querySelector("#instructions-button")
const instructionsModal = document.querySelector("#instructions")
const closeInstructionsButton = document.querySelector("#close-button")


const openingCrawl = [
    '17 years ago, in a galaxy real, real close...',
    'Planet Earth has declassified Pluto as a planet...',
    'Unbeknownst to Earth, this made the Plutonians furious',
    'Hero: Why did I become a captain for the space force',
    'Should have joined the damn Nav...',
    'SUDDEN EXPLOSION',
    'GROUND SHAKES',
    'YOU HEAR WHAT SOUNDS LIKE THE VOICE OF GOD',
    'ATTENTION ALL HUMANS, SEVERAL YEARS AGO YOU DECLASSIFIED OUR HOME',
    'AS A PLANET, WE PLUTONIANS ARE HERE FOR OUR REVENGE!',
    'LET/S SEE IF EARTH IS STILL CONSIDERED A PLANET AFTER WE ARE DONE WITH IT!',
    'Your mission should you choose to accept it is',
    'As the Captain of the Space Force it is your job to defend the Earth',
    'You will be piloting the U.S.S Razor Crest which comes with a laser firing system ',
    'You will need to defeat all enemy ships before you face the big boss',
    'Dodge their fire, and destroy their ships or all hope is lost',
    'Godspeed, Captain',
 ];

 const openingCrawlSpeed = 2
 let openingCrawlY = canvas.height

 function renderOpeningCrawl(){
    ctx.fillStyle ='#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Arial';
    ctx.fillStyle = "#fff";
    ctx.textAlign = 'center';
    let y = openingCrawlY
    
 }

 const heroShip = {
    x: canvas.width/2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    direction: null,
 }

 const enemyShipWidth = 50;
 const enemyShipHeight = 50;
 const enemyShipSpeed = 2;
 const enemyShipHealth = 5;
 const enemyShips = [];

 const bossShip ={
    x: canvas.width/ 2 - 100,
    y: -200,
    width: 200,
    height: 200,
    speed: 2,
    direction: "down",
    health: 20.
 }

 let bullets = []

 let gameIsOver = false
 let enemiesAreMovingDown = false
 let frames = 0
 let score = 0
 let gameStarted = false
 
 function startGame (){
    gameStarted = true;
    startScreen.style.display = "none";
    spawnEnemyShips();
    
 }

 function spawnEnemyShips(){
    const numCols = Math.floor(canvas.width/ enemyShipWidth)
    const numRows = 4
    for (let i = 0; i < numCols * numRows; i++){
        const x = (i % numCols) * enemyShipWidth;
        const y = Math.floor(i/ numCols) * enemyShipHeight;
        enemyShips.push({
            x,
            y,
            width: enemyShipWidth,
            height: enemyShipHeight,
            health: enemyShipHealth
        })
    }
 }

function handleInput (event){
    if(event.key === "a"){
        heroShip.direction ="left"
    } else if(event.key === "d"){
        heroShip.direction = "right"
    } else if (event.key === " "){
        bullets.push({
            x: heroShip.x + heroShip.width / 2,
            y: heroShip.y,
            width: 5,
            height: 10,
            speed: 10,
        })
    }
}

function handleRelease(event){
    if(event.ley === "a" && heroShip.direction === "left"){
        heroShip.direction = "null"
    } else if(event.key === "d" && heroShip.direction === "right"){
        heroShip.direction = "null"
    }
}

function moveHeroShip(){
    if (heroShip.direction === "left" && heroShip.x > 0){
        heroShip.x -= heroShip.speed
    } else if (heroShip.x === "righht" && heroShip.x + heroShip.width < canvas.width){
        heroShip.x += heroShip.speed
    }
}

function moveEnemyShips(){
    const numCols = Math.floor(canvas.width/ enemyShipWidth)
    const leftMostShip = enemyShips [0]
    const rightMostShip = enemyShips[enemyShips.length - 1]
    if(leftMostShip.x <= 0 && enemiesAreMovingDown === false){
        enemiesAreMovingDown = true
    } else if(rightMostShip.x + enemyShipWidth >= canvas.width && enemiesAreMovingDown === true){
        enemiesAreMovingDown = false
    } for (let i = 0 < enemyShips.length; i++){
        const enemy = enemyShips[i]
        if(enemiesAreMovingDown){
            enemy.x += enemyShipSpeed
        }
    }
}

function moveBoss