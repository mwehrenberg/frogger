/* global collideCircleCircle, loadImage, noStroke, textFont, color, cars, circle, textSize, text, hit, win, collideRectCircle, keyCode, UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, fill, rect, ellipse, random, width, height, createCanvas, HSB, colorMode, background, backgroundColor, frogX, frogY, score, lives, gameIsOver, car1X, car1Y, car1V
*/

let cars = [];
let lilypads = [];
let laneWidth, win, hit, frog, frogWidth, riverWidth, lilyRad, landing, gameWon, gameStart, laneSpace, carWidth, carHeight, textColor, backgroundColor, frogX, frogY, score, lives, gameIsOver, car1X, car1Y, car1V;

function setup() {
  // Canvas & color settings
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  textColor = color(100, 0, 0);
  textFont('Georgia');
  
  //position of frogger
  frogWidth = 20;
  frog = new Frog();
  
  //other variables
  gameStart = false;
  gameWon = false;
  score = 0;
  lives = [50, 65, 80];
  gameIsOver = false;
  
  //car x,y position and velocity
  laneSpace = 100;
  carWidth = 40;
  carHeight = 30;
  for (var i = 0; i<3; i++){
    //cars.push(randomCars());
    cars.push(new Car(laneSpace));
    laneSpace += 170;
  }
  //distribute height, through lanes
  //randomize position and check if another car is closeby
  
  //add lilypads
  laneWidth = 35;
  riverWidth = 80;
  lilyRad = 15;
  for (var i = 0; i<2; i++){
    lilypads.push(new Lilypad(120+laneWidth));
    laneWidth += laneWidth;
  }
}

function draw() {
  background(backgroundColor);
  // Code for gold goal line
  noStroke();
  fill(60, 80, 80);
  rect(0, 0, width, 50);
  
  // Code for river
  noStroke();
  fill(210, 80, 100);
  rect(0, 120, width, riverWidth);
  
  //display cars and lilypads
  for (let car of cars){
    car.drive();
    car.checkCollisions();
  }
  for (let lilypad of lilypads){
    lilypad.checkLilypadLanding();
    lilypad.float();
    //lilypad.carry();
  }
  
  // Code to display Frog
  frog.draw();
  frog.win();
  frog.checkDrown();
  
  //check for crash, landing, or win
  //checkCollisions();
  //checkLilyLanding();
  displayScores();
}

function keyPressed() {
  gameStart = true;
  if (!gameIsOver){
    if (keyCode === UP_ARROW) {
      frog.y -= 20;
    } else if (keyCode === DOWN_ARROW) {
      frog.y += 20;
    } else if (keyCode === RIGHT_ARROW) {
      frog.x += 20;
    } else if (keyCode === LEFT_ARROW) {
      frog.x -= 20;
    }
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
  if (score === 3){
    gameWon = true;
  }
}

function deleteLife(){
  //reposition frogger
  frog.x = width/2;
  frog.y = height - 50;
  //subtract lives
  lives.pop();
  if (lives.length == 0){
    gameIsOver = true;
  }
}

function displayScores() {
  fill(0);
  //display instructions before game starts
  if (!gameStart){
    textSize(20);
    text(`Get to the other side three times to win!`, width/6, height/2);
  }
  
  //settings for other text 
  textSize(12);
  
  // Display Lives
  text(`Lives:`, 10, 20);
  fill(60, 50, 100);
  for (var i=0; i<lives.length; i++){
    circle(lives[i], 15, 5);
  }
  
  // Display Score
  fill(textColor);
  text(`Score: ${score}`, 10, 40);
  
  // Display game over message if the game is over
  textSize(60);
  if (gameIsOver){
    text(`Game over!`, width/3, height/2);
  }
  
  // Display game over message if player wins
  if (gameWon){
    text(`You win!`, width/6, height/2);
  }
}

class Car{
  constructor(spacing){
    this.color = random(360);
    this.x = -carWidth;
    this.y = height - spacing;
    this.v = random(2,6);
  }
  
  drive(){
    this.x += this.v;
    if (this.x > width){
      this.x = -carWidth;
    }
    fill(this.color, 80, 80);
    rect(this.x, this.y, carWidth, carHeight);
  }
  
  checkCollisions(){
    hit = collideRectCircle(this.x,this.y,carWidth,carHeight,frog.x,frog.y,20);
    if (hit){
      deleteLife();
    }
  }
}

class Lilypad{
  constructor(y){
    this.x = random(width);
    this.y = y - lilyRad;
    this.v = random(3);
  }
  
  float(){
    this.x+= this.v;
    if (this.x > width && frog.onLilypad){
      console.log('reset');
      this.x = 0;
      frog.x = 0;
    } else if (this.x > width){
      this.x = 0;
    }
    fill(90, 50, 100);
    ellipse(this.x, this.y, lilyRad*2);
  }
  
  checkLilypadLanding(){
     frog.onLilypad = (frog.x > this.x-lilyRad && frog.x < this.x+lilyRad) && (frog.y < this.y+lilyRad && frog.y > this.y-lilyRad)
      if (frog.onLilypad){
        frog.x = this.x;
      }
  }
}

class Frog{
  constructor(){
    this.x = width/2;
    this.y = height - 50;
    this.onLilypad = false;
    this.inWater = false;
  }
  
  draw(){
    fill(120, 80, 80);
    ellipse(this.x, this.y, frogWidth);
  }
  
  win(){
    win = collideRectCircle(0, 0, width, 50, this.x, this.y, 20);
    if (win){
      score++;
      this.x = width/2;
      this.y = height - 50;
    }
    if (score === 3){
      gameWon = true;
    }
  }
  
  checkDrown(){
    this.inWater = collideRectCircle(0, 120+20, width, riverWidth-20, this.x, this.y, frogWidth);
    console.log(this.inWater);
    if (!this.onLilypad && this.inWater){
      deleteLife();
    }
  }
}