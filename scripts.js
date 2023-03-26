document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;
  
  const modal = document.getElementById("instructions-modal");
  const modalButton = document.getElementById("instructions-button");
  const span = document.getElementsByClassName("close")[0];

  let isGameEnded = false;
  let startGame = false;


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


  function handleKeyPressEvent(event) {
    const speed = 10;
    switch (event.key) {
      case "a":
        playerShip.x -= speed;
        break;
      case "d":
        playerShip.x += speed;
        break;
      case " ":
        playerShip.fireBullet();
        break;
      default:
        break;
    }
  }
  
  function handleKeyUpEvent(event) {
    if (event.code === "Space") {
      if (!playerShip.isAlive) {
        restart();
      } else if (bossShip.isAlive === false) {
        restart();
      }else{
        if(startGame == false){
          document.getElementById("play_message").style.display = 'none';
        start();
          startGame = true

      }
      }
    }
  }
  
  
  document.addEventListener("keydown", handleKeyPressEvent);
  document.addEventListener("keyup", handleKeyUpEvent);

  
  
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
        this.hitCount = 0; 
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
    for (let i = 0; i < 30; i++) {
      const alienShip = new AlienShip(i * 80 + 50, 50, 30, 30, "green", true, 5);
      alienShips.push(alienShip);
    }
    
    class Boss {
      constructor(x, y, width, height, color, isAlive, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isAlive = isAlive;
        this.speedX = speedX;
        this.speedY = speedY;
        this.hitCount = 0;
      }
      
    
      draw() {
        if (this.isAlive) {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }
    
      move() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x + this.width > canvas.width) {
          this.speedX = -this.speedX;
        }
        if (this.y < 0 || this.y + this.height > canvas.height) {
          this.speedY = -this.speedY;
        }
      }
      hit(){
        this.hitCount++;
        if(this.hitCount >= 15 && !isGameEnded){
          this.isAlive = false;
          playerShip.isAlive = false;
          isGameEnded = true;
          
    
      
      ctx.fillStyle = "red";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText("You Win!", canvas.width / 2 - 120, canvas.height / 2);
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("Press spacebar to play again", canvas.width / 2 - 150, canvas.height / 2 + 50);
    
        }
      }
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
  
  
  function checkCollisions() {
    if (bossShip.isAlive && playerShip.isAlive &&
        playerShip.x < bossShip.x + bossShip.width &&
        playerShip.x + playerShip.width > bossShip.x &&
        playerShip.y < bossShip.y + bossShip.height &&
        playerShip.y + playerShip.height > bossShip.y) {
      bossShip.hit();
      playerShip.isAlive = false;
    
      ctx.fillStyle = "red";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText("You lose!", canvas.width / 2 - 120, canvas.height / 2);
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("Press spacebar to play again", canvas.width / 2 - 150, canvas.height / 2 + 50);
     
      
    } else {
      for (let i = 0; i < playerShip.bullets.length; i++) {
        const bullet = playerShip.bullets[i];
        if (bossShip.isAlive && bullet.x < bossShip.x + bossShip.width && bullet.x + bullet.width > bossShip.x && bullet.y < bossShip.y + bossShip.height && bullet.y + bullet.height > bossShip.y) {
          bossShip.hit();
          playerShip.bullets.splice(i, 1);
          break;
        }
      }
    }
  }
  
  function restart() {
    isGameEnded = false;
    playerShip.isAlive = true;
    playerShip.x = canvas.width / 2 - playerShip.width / 2;
    playerShip.y = canvas.height - playerShip.height - 10;
  
    for (let i = 0; i < alienShips.length; i++) {
      const alienShip = alienShips[i];
      alienShip.isAlive = true;
      alienShip.hitCount = 0;
      alienShip.x = i * 80 + 50;
      alienShip.y = 50;
    }
  
    bossShip.isAlive = true;
    bossShip.hitCount = 0;
    bossShip.x = canvas.width / 2 - bossShip.width / 2;
    bossShip.y = 10;
  
    playerShip.bullets = [];
    playerShip.isAlive = true;
  
    alienShips.forEach((alienShip) => {
      alienShip.isAlive = true;
    });
    bossShip.isAlive = true;
    bossShip.hitCount = 0;
    window.setTimeout(function(){
    start();
  },500);
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerShip.draw();
    bossShip.draw();
    bossShip.move();
    for (let i = 0; i < alienShips.length; i++) {
      const alienShip = alienShips[i];
      alienShip.draw();
      alienShip.move();
    }
    checkCollisions();
    if (playerShip.isAlive) {
      window.requestAnimationFrame(render);
    }
  }
  
  document.addEventListener("keydown", handleKeyPressEvent);
  const playerShip = new Ship(100, canvas.height - 50, 50, 50, "red", true, 10);
  const bossShip = new Boss(200, 0, 100, 100, "purple", true, 5, 5);
  
  function start() {
    render();
  }
  

});