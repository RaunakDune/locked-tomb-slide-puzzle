// Credit:
// https://youtu.be/uQZLzhrzEs4


// Source image to chop up
let source;
let difficultySlider;
let refreshButton;

// Tiles configuration
let tiles = [];
let cols = 4;
let rows = 4;
let w, h;
let currentDifficulty = 100

// Order of tiles
let board = [];

// Loading the image
function preload() {
  source = loadImage("Gideon.jpg");
}

function setup() {
  createCanvas(601, 886);
  // pixel dimensions of each tiles
  w = width / cols;
  h = height / rows;
  
  // Chop up source image into tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(source, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }
  
  // Remove the last tile
  tiles.pop();
  board.pop();
  // -1 means empty spot
  board.push(-1);
  
  
  difficultySlider = createSlider(10, 1000, 100, 50);
  refreshButton = createButton('Update Shuffle Difficulty');
  refreshButton.mousePressed(shuffleAfterUpdate);
  
  
  // Shuffle the board
  simpleShuffle(board, currentDifficulty);
  
  
}

function initializeBoard(){
  // pixel dimensions of each tiles
  w = width / cols;
  h = height / rows;
  board.length = 0;
  
  // Chop up source image into tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      img.copy(source, x, y, w, h, 0, 0, w, h);
      let index = i + j * cols;
      board.push(index);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }
  
  // Remove the last tile
  tiles.pop();
  board.pop();
  // -1 means empty spot
  board.push(-1);
}

// Swap two elements of an array
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Pick a random spot to attempt a move
// This should be improved to select from only valid moves
function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  move(r1, r2, arr);
}

// Shuffle the board
function simpleShuffle(arr, dif) {
  for (let i = 0; i < dif; i++) {
    randomMove(arr);
  }
  // redraw();
}

function shuffleAfterUpdate() {
  initializeBoard();
  simpleShuffle(board, difficultySlider.value());
  redraw();
}

// Move based on click
function mouseReleased() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i,j,board);
}



function draw() {
  background(0);
  
  if (!isSolved() && !isLooping()){
    loop();
  }
  // const v = difficultySlider.value();
  

  // Draw the current board
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) {
        let img = tiles[tileIndex].img;
        image(img, x, y, w, h);
      }
    }
  }
  
  // Show it as grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      strokeWeight(2);
      noFill();
      rect(x, y, w, h);
    }
  }
  text('Difficulty', difficultySlider.x * 2 + difficultySlider.width, 1000);
  
  // If it is solved
  if (isSolved()) {
    // console.log("SOLVED")
    alert("You've done the thing!!!");
    
    noLoop();
  }
}

// Check if solved
function isSolved() {
  for (let i = 0; i < board.length-1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true;
}

// Swap two pieces
function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);
  
  // Double check valid move
  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

// Check if neighbor
function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}


// Probably could just use a variable
// to track blank spot
function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i;
  }
}
