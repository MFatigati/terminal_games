/* Tic Tac Toe is a 2-player board game.
The board is a 3x3 grid.
Players take turns marking a square with a marker that identifies the player.
Traditionally, the player to go first uses the marker X to mark her squares, and
  the player to go second uses the marker O.
The first player to mark 3 squares in a row with her marker wins the game.
A row can be a horizontal row, a vertical column, or either of the two diagonals
  (top-left to bottom-right and top-right to bottom-left).
There is one human player and one computer player.
The human player always moves (places a marker) first in the initial version of
  our game; you can change that later. */

// Game (n)
// Board (n)
// Row (n)
// Square (n)
// Marker (n)
// Player (n)
// Mark (v)
// Play (v)
// Human (n)
// Computer (n)

let readline = require("readline-sync");

function Square(marker = Square.UNUSED_SQUARE) {
  this.marker = marker;
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

Square.prototype.setMarker = function(marker) {
  this.marker = marker;
};

Square.prototype.toString = function() {
  return this.marker;
};

Square.prototype.getMarker = function() {
  return this.marker;
};

Square.prototype.isUnused = function() {
  return this.marker === Square.UNUSED_SQUARE; // because each Square object has a marker
};

function Board() {
  this.squares = {};
  for (let counter = 1; counter <= 9; counter += 1) { // 9 seems like a magic number
    this.squares[counter] = new Square();
  }
}

Board.prototype.display = function() {
  console.log("");
  console.log("     |     |");
  console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
  console.log("     |     |");
  console.log("");
};

Board.prototype.displayWithClear = function() {
  console.clear();
  console.log(" ");
  this.display();
};

Board.prototype.markSquareAt = function(key, marker) {
  this.squares[key].setMarker(marker);
  // because what is accessed by this.squares[key] is a
  // a Square object (see constructor), so
  // you are able to call the setMarker method on them
};

Board.prototype.unusedSquares = function() { // gets you an array of unused squares
  let keys = Object.keys(this.squares);
  return keys.filter(key => this.squares[key].isUnused()); // accessing Square objects
};

Board.prototype.isFull = function() { // tests to see if the array of unused squares is 0
  return this.unusedSquares().length === 0;
};

Board.prototype.countMarkersFor = function(player, keys) { // keys will be one of the winning three combinations
  let markers = keys.filter(key => {
    return this.squares[key].getMarker() === player.getMarker();
    // checks current board object to get marker for square corresponding to
    // the current number in the winning combos array, then checks to see if
    // that marker is the player's marker who we are checking
  });

  return markers.length;
};

function Player(marker) {
  this.marker = marker;
}

Player.prototype.getMarker = function() {
  return this.marker;
};

function Human() {
  Player.call(this, Square.HUMAN_MARKER);
  // Allows you to reuse the Player constructor in this context
}

Human.prototype = Object.create(Player.prototype);
Human.prototype.constructor = Human;

function Computer() {
  Player.call(this, Square.COMPUTER_MARKER);
}

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

function TTTGame() {
  this.board = new Board();
  this.human = new Human();
  this.computer = new Computer();
}

TTTGame.POSSIBLE_WINNING_ROWS = [
  [ "1", "2", "3" ],            // top row of board
  [ "4", "5", "6" ],            // center row of board
  [ "7", "8", "9" ],            // bottom row of board
  [ "1", "4", "7" ],            // left column of board
  [ "2", "5", "8" ],            // middle column of board
  [ "3", "6", "9" ],            // right column of board
  [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
  [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
];

TTTGame.prototype.play = function() {
  this.displayWelcomeMessage();
  this.board.display();

  while (true) {

    this.humanMoves();
    if (this.gameOver()) break;

    this.computerMoves();
    if (this.gameOver()) break;

    this.board.displayWithClear();
  }

  this.board.displayWithClear();
  this.displayResults();
  this.displayGoodbyeMessage();
};

TTTGame.prototype.displayWelcomeMessage = function() {
  console.clear();
  console.log("Welcome to Tic Tac Toe!");
};

TTTGame.prototype.displayGoodbyeMessage = function() {
  console.log("Thanks for playing Tic Tac Toe! Goodbye!");
};

TTTGame.prototype.displayResults = function() {
  if (this.isWinner(this.human)) {
    console.log("You won! Congratulations!");
  } else if (this.isWinner(this.computer)) {
    console.log("I won! I won! Take that, human!");
  } else {
    console.log("A tie game. How boring.");
  }
};

TTTGame.prototype.isWinner = function(player) {
  return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
    return this.board.countMarkersFor(player, row) === 3;
    // for one of those rows, are all three of them of the marker
    // type for the specified player? The function uses filter to create
    // a new array with any that are. If the length of the new array
    // is 3, this function returns true;
  });
};

TTTGame.prototype.humanMoves = function() {
  let choice;

  while (true) {
    let validChoices = this.board.unusedSquares();
    console.log(`Choose a square: ${validChoices}`);
    choice = readline.prompt();

    if (validChoices.includes(choice)) break;

    console.log("Sorry, that's not a valid choice.");
    console.log("");
  }

  this.board.markSquareAt(choice, this.human.getMarker());
  // accessing the Board object on TTTGame, which has access
  // to the markSquareAt method, which itself calls
  // setMarker on the Square objects that populate the Board
};

TTTGame.prototype.computerMoves = function() {
  let validChoices = this.board.unusedSquares();
  let choice;

  do {
    choice = Math.floor((9 * Math.random()) + 1).toString();
  }
  while (!validChoices.includes(choice));
  this.board.markSquareAt(choice, this.computer.getMarker());
};

TTTGame.prototype.gameOver = function() {
  return this.board.isFull() || this.someoneWon();
};

TTTGame.prototype.someoneWon = function() {
  return this.isWinner(this.human) || this.isWinner(this.computer);
};

let game = new TTTGame();
game.play();