let readline = require("readline-sync");

class Square {
    static UNUSED_SQUARE = " ";
    static HUMAN_MARKER = "X";
    static COMPUTER_MARKER = "O";

    constructor(marker = Square.UNUSED_SQUARE) {
      this.marker = marker;
    }

    setMarker(marker) {
      this.marker = marker;
    }

    toString() {
      return this.marker;
    }

    getMarker() {
      return this.marker;
    }

    isUnused() {
      return this.marker === Square.UNUSED_SQUARE; // because each Square object has a marker
    }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[counter] = new Square();
    }
  }

  display() {
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
  }

  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
    // because each of these is a Square object (see constructor)
    // you are able to call the setMarker method on them
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) { // keys will be one of the winning three combinations
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
      // checks current board object to get marker for square corresponding to
      // the current number in the winning combos array, then checks to see if
      // that marker is the player's marker who we are checking
    });

    return markers.length;
  }

  joinOr(inputArr, delimeter = ",", finalDelimeter = "or") {
    delimeter = delimeter.trim() + " ";
    finalDelimeter = finalDelimeter.trim() + " ";

    if (inputArr.length <= 2) {
      finalDelimeter = " " + finalDelimeter;
      return inputArr.join(finalDelimeter);
    } else {
      let firstPart = inputArr.slice(0, inputArr.length - 1).
        join(delimeter) + delimeter;
      return firstPart + finalDelimeter + inputArr[inputArr.length - 1];
    }
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[counter] = new Square();
    }
  }

  findCriticalSquareForPlayer(player, possibleWinningRows) {
    let criticalSquare;
    possibleWinningRows.forEach(row => {
      if (this.countMarkersFor(player, row) === 2) {
        row.forEach(square => {
          if (this.unusedSquares().includes(square)) {
            criticalSquare = square;
          }
        });
      }
    });
    return criticalSquare;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.first = false;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
    this.first = true;
  }

  humanMoves(currentBoard) {
    console.log(this);
    let choice;

    while (true) {
      let validChoices = currentBoard.unusedSquares();
      console.log(`Choose a square: ${currentBoard.joinOr(validChoices)}`);
      choice = readline.prompt();

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    currentBoard.markSquareAt(choice, this.getMarker());
    // accessing the Board object on TTTGame, which has access
    // to the markSquareAt method, which itself calls
    // setMarker on the Square objects that populate the Board
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
    this.first = false;
  }

  computerMoves(currentBoard, currentHuman, possibleWinningRows) { // eslint-disable-line max-len
    let validChoices = currentBoard.unusedSquares();
    let choice = this.computerReturnSquareToWin(currentBoard, possibleWinningRows); // eslint-disable-line max-len
    if (!choice) {
      choice = this.computerReturnThreatenedSquare(currentBoard, currentHuman, possibleWinningRows); // eslint-disable-line max-len
    }
    if (!choice && this.isFiveAvailable(currentBoard, currentHuman)) { // eslint-disable-line max-len
      choice = ['5'];
    }
    if (!choice) {
      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      }
      while (!validChoices.includes(choice));
    }
    currentBoard.markSquareAt(choice, this.getMarker());
  }

  computerReturnThreatenedSquare(currentBoard, currentHuman, possibleWinningRows) { // eslint-disable-line max-len
    let threatenedSquare = currentBoard.findCriticalSquareForPlayer(currentHuman, possibleWinningRows); // eslint-disable-line max-len
    return threatenedSquare;
  }

  computerReturnSquareToWin(currentBoard, possibleWinningRows) { // eslint-disable-line max-len
    let squareToWin = currentBoard.findCriticalSquareForPlayer(this, possibleWinningRows); // eslint-disable-line max-len
    return squareToWin;
  }

  isFiveAvailable(currentBoard, currentHuman) {
    if (currentBoard.squares["5"].getMarker() === currentHuman.getMarker() ||
        currentBoard.squares["5"].getMarker() === this.getMarker()) {
      return false;
    } else return true;
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

    static POSSIBLE_WINNING_ROWS = [
      [ "1", "2", "3" ],            // top row of board
      [ "4", "5", "6" ],            // center row of board
      [ "7", "8", "9" ],            // bottom row of board
      [ "1", "4", "7" ],            // left column of board
      [ "2", "5", "8" ],            // middle column of board
      [ "3", "6", "9" ],            // right column of board
      [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
      [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
    ];

    play() {
      this.displayWelcomeMessage();
      this.board.display();

      while (true) {

        this.playOneGame();
        this.board.displayWithClear();
        this.displayResults();
        if (!this.playAgain()) break;

        this.board.reset();
        this.board.displayWithClear();
        this.swapWhoIsFirst();
      }

      this.displayGoodbyeMessage();
    }

    playOneGame() {
      while (true) {
        if (this.human.first === true) {

          this.human.humanMoves(this.board);
          if (this.gameOver()) break;

          this.computer.computerMoves(this.board, this.human, TTTGame.POSSIBLE_WINNING_ROWS); // eslint-disable-line max-len
          if (this.gameOver()) break;

        } else if (this.computer.first === true) {

          this.computer.computerMoves(this.board, this.human, TTTGame.POSSIBLE_WINNING_ROWS); // eslint-disable-line max-len
          if (this.gameOver()) break;
          this.board.displayWithClear();

          this.human.humanMoves(this.board);
          if (this.gameOver()) break;

        }

        this.board.displayWithClear();
      }
    }

    swapWhoIsFirst() {
      this.human.first = !this.human.first;
      this.computer.first = !this.computer.first;
    }

    displayWelcomeMessage() {
      console.clear();
      console.log("Welcome to Tic Tac Toe!");
    }

    displayGoodbyeMessage() {
      console.clear();
      console.log("Thanks for playing Tic Tac Toe! Goodbye!");
      console.log(" ");
    }

    displayResults() {
      if (this.isWinner(this.human)) {
        console.log("You won! Congratulations!");
      } else if (this.isWinner(this.computer)) {
        console.log("I won! I won! Take that, human!");
      } else {
        console.log("A tie game. How boring.");
      }
    }

    isWinner(player) {
      return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
        return this.board.countMarkersFor(player, row) === 3;
      });
    }

    gameOver() {
      return this.board.isFull() || this.someoneWon();
    }

    someoneWon() {
      return this.isWinner(this.human) || this.isWinner(this.computer);
    }

    playAgain() {
      console.log(" ");
      let choice = readline.question(`Do you want to play again? (y/n)`);
      while (choice !== "y" && choice !== "n") {
        choice = readline.question(`Invalid choice. Please enter 'y' or 'n'`);
      }
      return choice === 'y';
    }
}

let game = new TTTGame();
game.play();