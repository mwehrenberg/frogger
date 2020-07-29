/* global circle, textSize, text, hit, win, collideRectCircle, keyCode, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, fill, rect, ellipse, random, width, height, createCanvas, HSB, colorMode, background, backgroundColor, frogX, frogY, score, lives, gameIsOver, car1X, car1Y, car1V
*/

let backgroundColor, frogX, frogY, score, lives, gameIsOver, car1X, car1Y, car1V;

function setup() {
  // Canvas & color settings
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  
  //position of frogger
  frogX = width/2;
  frogY = height - 50;
  
  score = 0;
  //lives = 3;
  lives = [50, 65, 80];
  gameIsOver = false;
  
  //car x,y position and velocity
  car1X = 0;
  car1Y = 100;
  car1V = 5;
}

function draw() {
  background(backgroundColor);
  // Code for gold goal line
  fill(60, 80, 80);
  rect(0, 0, width, 50);
  // Code to display Frog
  fill(120, 80, 80);
  ellipse(frogX, frogY, 20);
  moveCars();
  drawCars();
  checkCollisions();
  checkWin();
  displayScores();
}

function keyPressed() {
  if (!gameIsOver){
    if (keyCode === UP_ARROW) {
      frogY -= 20;
    } else if (keyCode === DOWN_ARROW) {
      frogY += 20;
    } else if (keyCode === RIGHT_ARROW) {
      frogX += 20;
    } else if (keyCode === LEFT_ARROW) {
      frogX -= 20;
    }
  }
}

function moveCars() {
  // Move the car
  car1X = car1X + car1V;
  // Reset if it moves off screen
  if (car1X > width){
    car1X = -40;
  }
}

function drawCars() {
  // Code for car 1
  fill(0, 80, 80);
  rect(car1X, car1Y, 40, 30);
  // Code for additional cars
}

function checkCollisions() {
  // If the frog collides with the car, reset the frog and subtract a life.
  hit = collideRectCircle(car1X,car1Y,40,30,frogX,frogY,20);
  if (hit){
    //reposition frogger
    frogX = width/2;
    frogY = height - 50;
    //subtract lives
    lives.pop();
  }
  if (lives.length == 0){
      gameIsOver = true;
  }
  
}

function checkWin() {
  // If the frog makes it into the yellow gold zone, increment the score
  // and move the frog back down to the bottom.
  win = collideRectCircle(0, 0, width, 50, frogX, frogY, 20);
  if (win){
    score++;
    //reposition frogger
    frogX = width/2;
    frogY = height - 50;
  }
}

function displayScores() {
  textSize(12);
  fill(0);
  // Display Lives
  text(`Lives:`, 10, 20);
  for (var i=0; i<lives.length; i++){
    circle(lives[i], 16, 5);
  }
  
  // Display Score
  text(`Score: ${score}`, 10, 40);
  // Display game over message if the game is over
  textSize(60);
  if (gameIsOver){
    text(`Game over!`, width/6, height/2);
  }
}