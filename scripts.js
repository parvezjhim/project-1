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


function handleKeyPressEvent(e){
    const speed = 5
    switch(e.key){
        case "w":
            hero.y -= speed
            break;
        case 's':
            hero.y += speed
            break;
        case 'a':
            hero.x -= speed
            break;
        case 'd':
            hero.x += speed
            break;
        case " ":
        console.log("fire")
        break;
    }
}

 class Character {
    constructor(x, y, width, height, color, speed){
      this.x = x
      this.y = y
      this.width = width
      this.height= height
      this.color = color
      this.alive = true
      this.speed = speed
      
    }  
    render(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        

    }
 }

 document.addEventListener("keydown", handleKeyPressEvent)


 class Projectiles {
    constructor(position, speed){
        this.position = position
        this.speed = speed
        this.radius = 3
    }
    render(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.render()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
 }

 const projectiles = []
 const hero = new Character (200, 200, 100, 100, "red", 5)
 const alien1 = new Character ()
 const alien2 = new Character ()
 const alien3 = new Character ()
 const alien4 = new Character ()
 const alien5 = new Character ()
 const boss = new Character ()

