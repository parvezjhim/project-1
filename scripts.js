const playerShipImage = new Image()
playerShipImage.src= "./images/spaceship.png"

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    
    const modal = document.getElementById("instructions-modal");
    const modalButton = document.getElementById("instructions-button");
    const span = document.getElementsByClassName("close")[0];
    modalButton.onclick = function (){
      modal.style.display = "block";
    };
  
    span.onclick = function (){
      modal.style.display = "none";
    };
  
    window.onclick = function (event){
      if (event.target == modal){
        modal.style.display = "none";
      }
    };
  
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
  
    function handleKeyPressEvent(e){
      const speed = 10;
      switch(e.key){
        case "a":
          playerShip.x -= speed;
          break;
        case "d":
          playerShip.x += speed;
          break;
        case " ":
            console.log("spacebarpressed")
          playerShip.fireBullet();
          break;
          
      }
    } 
    
  
    class Ship {
        constructor(x, y, width, height, color, isAlive, speed) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.color = color;
          this.isAlive = true;
          this.speed = speed;
          this.bullets = [];
        }
      
        draw() {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          this.drawBullets();
        }
      
        fireBullet() {
          const bulletWidth = 5;
          const bulletHeight = 10;
          const bulletColor = "yellow";
          const bulletSpeed = 5;
          const bulletX = this.x + this.width / 2 - bulletWidth / 2;
          const bulletY = this.y - bulletHeight;
          const bullet = new Bullet(bulletX, bulletY, bulletWidth, bulletHeight, bulletColor, bulletSpeed);
          this.bullets.push(bullet);
          console.log("bullet", bullet)
          console.log("bullets", this.bullets)
        }
      
        drawBullets() {
          for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.draw();
            bullet.move();
            for (let j = 0; j < alienShips.length; j++) { 
              const alienShip = alienShips[j];
              if (alienShip.isAlive && bullet.x < alienShip.x + alienShip.width && bullet.x + bullet.width > alienShip.x && bullet.y < alienShip.y + alienShip.height && bullet.y + bullet.height > alienShip.y) {
                alienShip.hitCount++; 
                if (alienShip.hitCount >= 5) {
                  alienShip.isAlive = false; 
                }
                this.bullets.splice(i, 1);
                break; 
              }
            }
            if (bullet.isOffScreen()) {
              this.bullets.splice(i, 1);
            }
          }
        }
      }
      
      class AlienShip {
        constructor(x, y, width, height, color, isAlive, speed) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.color = color;
          this.isAlive = isAlive;
          this.speed = speed;
          this.hitCount = 0; // change the amount of hits needed the game is too easy right now.
        }
      
        draw() {
          if (this.isAlive) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
          }
        }
      
        move() {
          this.x += this.speed;
      
          if (this.x < 0 || this.x + this.width > canvas.width) {
            this.speed = -this.speed;
            this.y += 20;
          }
        }
      }
      
      const alienShips = [];
      for (let i = 0; i < 10; i++) {
        const alienShip = new AlienShip(i * 80 + 50, 50, 30, 30, "green", true, 5);
        alienShips.push(alienShip);
      }
      
      class Bullet {
        constructor(x, y, width, height, color, speed) {
          this.x = x;
          this.y = y;
          this.width = width;
            this.height = height;
            this.color = color;
            this.speed = speed;
        }
        draw(){
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        move(){
            this.y -= this.speed
        }
        isOffScreen(){
            return this.y + this.height < 0;
        }
    }
    document.addEventListener("keydown", handleKeyPressEvent);
    const playerShip = new Ship(100,canvas.height - 50, 50, 50, "red", true, 10);
    const bossShip = new Ship(200, 0, 100, 100, "purple", true, 0);

    

    function render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playerShip.draw();
        bossShip.draw();
        for(let i =0; i< alienShips.length; i++){
            const alienShip = alienShips[i];
            alienShip.draw();
            alienShip.move()
        }
        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
});