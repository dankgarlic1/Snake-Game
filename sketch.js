// Import the required libraries (in the case of a web environment, these would be included via script tags in HTML)
let SPEED = 0.36;
let SNAKE_SIZE = 9;
let APPLE_SIZE = SNAKE_SIZE;
let SEPARATION = 10;
let SCREEN_HEIGHT = 600;
let SCREEN_WIDTH = 800;
let FPS = 25;
let KEY = { UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };

let snake;
let apples = [];
let gameClock;
let score = 0;
let endgame = false;
let startTime;

// p5.js setup function
function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  frameRate(FPS);

  // Initialize the snake
  snake = new Snake(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  snake.setDirection(KEY.UP);
  snake.move();
  let start_segments = 3;
  while (start_segments > 0) {
    snake.grow();
    snake.move();
    start_segments--;
  }

  // Initialize the apples
  respawnApples(1, snake.x, snake.y);
  startTime = millis();
}

function draw() {
  background(0);

  if (endgame) {
    displayEndGame();
    return;
  }

  gameClock = millis() - startTime;

  // Handle input
  let keyPress = getKey();
  if (keyPress === "exit") {
    endgame = true;
  }

  // Check collisions
  checkLimits(snake);
  if (snake.checkCrashing()) {
    endgame = true;
  }

  for (let apple of apples) {
    if (apple.state === 1) {
      if (checkCollision(snake.getHead(), SNAKE_SIZE, apple, APPLE_SIZE)) {
        snake.grow();
        apple.state = 0;
        score += 10;
        respawnApple(apples.indexOf(apple), snake.x, snake.y);
      }
    }
    apple.draw();
  }

  // Update position and draw snake
  snake.move();
  snake.draw();

  drawScore();
  drawGameTime(gameClock);
}

// Check collision between two objects
function checkCollision(posA, As, posB, Bs) {
  if (
    posA.x < posB.x + Bs &&
    posA.x + As > posB.x &&
    posA.y < posB.y + Bs &&
    posA.y + As > posB.y
  ) {
    return true;
  }
  return false;
}

// Ensure snake stays within screen limits
function checkLimits(snake) {
  if (snake.x > SCREEN_WIDTH) snake.x = SNAKE_SIZE;
  if (snake.x < 0) snake.x = SCREEN_WIDTH - SNAKE_SIZE;
  if (snake.y > SCREEN_HEIGHT) snake.y = SNAKE_SIZE;
  if (snake.y < 0) snake.y = SCREEN_HEIGHT - SNAKE_SIZE;
}

class Apple {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.color = color("orange");
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, APPLE_SIZE, APPLE_SIZE);
  }
}

class Segment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = KEY.UP;
    this.color = "white";
  }
}

class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = KEY.UP;
    this.stack = [];
    this.stack.push(this);
    let blackBox = new Segment(this.x, this.y + SEPARATION);
    blackBox.direction = KEY.UP;
    blackBox.color = "NULL";
    this.stack.push(blackBox);
  }

  move() {
    let last_element = this.stack.length - 1;
    while (last_element !== 0) {
      this.stack[last_element].direction =
        this.stack[last_element - 1].direction;
      this.stack[last_element].x = this.stack[last_element - 1].x;
      this.stack[last_element].y = this.stack[last_element - 1].y;
      last_element--;
    }
    let last_segment;
    if (this.stack.length < 2) {
      last_segment = this;
    } else {
      last_segment = this.stack.pop();
    }
    last_segment.direction = this.stack[0].direction;
    if (this.stack[0].direction === KEY.UP) {
      last_segment.y = this.stack[0].y - SPEED * FPS;
    } else if (this.stack[0].direction === KEY.DOWN) {
      last_segment.y = this.stack[0].y + SPEED * FPS;
    } else if (this.stack[0].direction === KEY.LEFT) {
      last_segment.x = this.stack[0].x - SPEED * FPS;
    } else if (this.stack[0].direction === KEY.RIGHT) {
      last_segment.x = this.stack[0].x + SPEED * FPS;
    }
    this.stack.unshift(last_segment);
  }

  getHead() {
    return this.stack[0];
  }

  grow() {
    let last_element = this.stack.length - 1;
    let newSegment;
    let blackBox;
    if (this.stack[last_element].direction === KEY.UP) {
      newSegment = new Segment(
        this.stack[last_element].x,
        this.stack[last_element].y - SNAKE_SIZE
      );
      blackBox = new Segment(newSegment.x, newSegment.y - SEPARATION);
    } else if (this.stack[last_element].direction === KEY.DOWN) {
      newSegment = new Segment(
        this.stack[last_element].x,
        this.stack[last_element].y + SNAKE_SIZE
      );
      blackBox = new Segment(newSegment.x, newSegment.y + SEPARATION);
    } else if (this.stack[last_element].direction === KEY.LEFT) {
      newSegment = new Segment(
        this.stack[last_element].x - SNAKE_SIZE,
        this.stack[last_element].y
      );
      blackBox = new Segment(newSegment.x - SEPARATION, newSegment.y);
    } else if (this.stack[last_element].direction === KEY.RIGHT) {
      newSegment = new Segment(
        this.stack[last_element].x + SNAKE_SIZE,
        this.stack[last_element].y
      );
      blackBox = new Segment(newSegment.x + SEPARATION, newSegment.y);
    }

    blackBox.color = "NULL";
    this.stack.push(newSegment);
    this.stack.push(blackBox);
  }

  checkCrashing() {
    for (let i = 1; i < this.stack.length - 1; i++) {
      if (
        checkCollision(this.stack[0], SNAKE_SIZE, this.stack[i], SNAKE_SIZE) &&
        this.stack[i].color !== "NULL"
      ) {
        return true;
      }
    }
    return false;
  }

  draw() {
    fill("green");
    rect(this.stack[0].x, this.stack[0].y, SNAKE_SIZE, SNAKE_SIZE);
    for (let i = 1; i < this.stack.length; i++) {
      if (this.stack[i].color === "NULL") continue;
      fill("yellow");
      rect(this.stack[i].x, this.stack[i].y, SNAKE_SIZE, SNAKE_SIZE);
    }
  }

  setDirection(direction) {
    if (
      (this.direction === KEY.RIGHT && direction === KEY.LEFT) ||
      (this.direction === KEY.LEFT && direction === KEY.RIGHT) ||
      (this.direction === KEY.UP && direction === KEY.DOWN) ||
      (this.direction === KEY.DOWN && direction === KEY.UP)
    ) {
      return;
    }
    this.direction = direction;
  }
}

// Handle key presses
function getKey() {
  if (keyIsDown(UP_ARROW)) return KEY.UP;
  if (keyIsDown(DOWN_ARROW)) return KEY.DOWN;
  if (keyIsDown(LEFT_ARROW)) return KEY.LEFT;
  if (keyIsDown(RIGHT_ARROW)) return KEY.RIGHT;
  if (keyIsDown(ESCAPE)) return "exit";
}

function drawScore() {
  fill("red");
  textSize(28);
  text("Score: " + score, SCREEN_WIDTH - 120, 40);
}

function drawGameTime(gameTime) {
  fill("white");
  textSize(28);
  text("Time: " + (gameTime / 1000).toFixed(2), 30, 40);
}

function displayEndGame() {
  textSize(46);
  fill("white");
  text("Game Over", SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2);
  textSize(28);
  fill("green");
  text("Play Again? (Y/N)", SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 + 50);
  if (keyIsDown(89)) {
    // 'Y' key
    endgame = false;
    score = 0;
    setup();
  } else if (keyIsDown(78)) {
    // 'N' key
    noLoop();
  }
}

// Reposition an apple when eaten
function respawnApple(index, sx, sy) {
  let radius =
    Math.sqrt(
      (SCREEN_WIDTH / 2) * (SCREEN_WIDTH / 2) +
        (SCREEN_HEIGHT / 2) * (SCREEN_HEIGHT / 2)
    ) / 2;
  let angle = 999;
  while (angle > radius) {
    angle = Math.floor(Math.random() * radius);
  }
  let px = Math.floor(Math.random() * SCREEN_WIDTH);
  let py = Math.floor(Math.random() * SCREEN_HEIGHT);
  if (px + APPLE_SIZE < SCREEN_WIDTH && py + APPLE_SIZE < SCREEN_HEIGHT) {
    if (
      px > SNAKE_SIZE &&
      px < SCREEN_WIDTH - SNAKE_SIZE &&
      py > SNAKE_SIZE &&
      py < SCREEN_HEIGHT - SNAKE_SIZE
    ) {
      apples[index] = new Apple(px, py, 1);
    }
  }
}

// Spawn apples randomly
function respawnApples(n, sx, sy) {
  for (let i = 0; i < n; i++) {
    respawnApple(i, sx, sy);
  }
}
