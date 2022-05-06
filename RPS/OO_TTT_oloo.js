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

let Square = {
  UNUSED_SQUARE: " ",
  HUMAN_MARKER: "X",
  COMPUTER_MARKER: "O",

  init(marker = Square.UNUSED_SQUARE) {
    // UNUSED_SQUARE exists on the Square object,
    // which becomes the prototype for Square objects
    // but we need to set a marker property on each
    // instance of Square
    this.marker = marker;
    return this;
  },

  setMarker: function(marker) {
    this.marker = marker;
  },

  toString: function() {
    return this.marker;
  },

  getMarker: function() {
    return this.marker;
  },

  isUnused: function() {
    return this.marker === Square.UNUSED_SQUARE; // because each Square object has a marker
  }
};

let Board = {
  init() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) { // 9 seems like a magic number
      this.squares[counter] = Object.create(Square).init();
    }
    return this;
  },

  display: function() {
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
  },

  displayWithClear: function() {
    console.clear();
    console.log(" ");
    this.display();
  },

  markSquareAt: function(key, marker) {
    this.squares[key].setMarker(marker);
    // because what is accessed by this.squares[key] is a
    // a Square object (see constructor), so
    // you are able to call the setMarker method on them
  },

  unusedSquares: function() { // gets you an array of unused squares
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused()); // accessing Square objects
  },

  isFull: function() { // tests to see if the array of unused squares is 0
    return this.unusedSquares().length === 0;
  },

  countMarkersFor: function(player, keys) { // keys will be one of the winning three combinations
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
      // checks current board object to get marker for square corresponding to
      // the current number in the winning combos array, then checks to see if
      // that marker is the player's marker who we are checking
    });

    return markers.length;
  }
};

let Player = {
  initPlayer(marker) {
    this.marker = marker;
    return this;
  },

  getMarker: function() {
    return this.marker;
  }
};

let Human = Object.create(Player);
Human.init = function() {
  return this.initPlayer(Square.HUMAN_MARKER);
  // need to access initPlayer on this, otherwise
  // will look in the global scope, and not find it
};

let Computer = Object.create(Player);
Computer.init = function() {
  return this.initPlayer(Square.COMPUTER_MARKER);
};

let TTTGame = {
  init() {
    this.board = Object.create(Board).init();
    this.human = Object.create(Human).init();
    this.computer = Object.create(Computer).init();
    return this;
  },

  POSSIBLE_WINNING_ROWS: [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ],

  play: function() {
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
  },

  displayWelcomeMessage: function() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
  },

  displayGoodbyeMessage: function() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  },

  displayResults: function() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  },

  isWinner: function(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    // for one of those rows, are all three of them of the marker
    // type for the specified player? The function uses filter to create
    // a new array with any that are. If the length of the new array
    // is 3, this function returns true;
    });
  },

  humanMoves: function() {
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
  },

  computerMoves: function() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    }
    while (!validChoices.includes(choice));
    this.board.markSquareAt(choice, this.computer.getMarker());
  },

  gameOver: function() {
    return this.board.isFull() || this.someoneWon();
  },

  someoneWon: function() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }
};

let game = Object.create(TTTGame).init();
game.play();