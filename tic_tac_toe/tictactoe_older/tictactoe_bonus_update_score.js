/*

1 Display the initial empty 3x3 board.
2 Ask the user to mark a square.
3 Computer marks a square.
4 Display the updated board state.
5 If it's a winning board, display the winner.
6 If the board is full, display tie.
7 If neither player won and the board is not full, go to #2
8 Play again?
9 If yes, go to #1
10 Goodbye! */

/* let board = {
  1: 'X',
  2: ' ',
  3: ' ',
  4: ' ',
  5: 'O',
  6: ' ',
  7: ' ',
  8: ' ',
  9: 'X',
} */

const rlSync = require("readline-sync");
const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";
const GAMES_REQUIRED_TO_WIN = 2;

function displayBoard(board) {
  console.clear()

  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}`)

  console.log(`
     |     |
  ${board['1']}  |  ${board['2']}  |  ${board['3']}
     |     |
-----+-----+-----     
     |     |
  ${board['4']}  |  ${board['5']}  |  ${board['6']}
     |     |
-----+-----+-----
     |     |
  ${board['7']}  |  ${board['8']}  |  ${board['9']}
     |     |
`)
}

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square += 1) {
    board[String(square)] = INITIAL_MARKER;
  }
  return board;
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
  prompt(`Choose a square ${joinOr(emptySquares(board))}:`);
  square = rlSync.question().trim();
  if (emptySquares(board).includes(square)) break;
  
  prompt("Sorry, that's not a valid choice.")
  
  }
  board[square] = HUMAN_MARKER;
}

function computerChoosesSquare(board) {
  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);

  let square = emptySquares(board)[randomIndex];
  board[square] = COMPUTER_MARKER;
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function prompt(text) {
  console.log(text);
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectWinner(board);
}

function detectWinner(board) {
  let winningLines = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
    [1, 5, 9], [3, 5, 7]             // diagonals
  ];

  for (let line = 0; line < winningLines.length; line ++) {
    let [sq1, sq2, sq3] = winningLines[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'Computer';
    }
  }
  return null;
}

function joinOr(arr, generalDelim = ",", lastDelim = "or") {
  let string = "";

  switch (arr.length) {
    case 0:
      return string;
    case 1:
      return string += arr[0]
    case 2:
      return string += arr[0] + " " + lastDelim.trim() + " " + arr[1];
    default:
      return arr.slice(0, arr.length - 1).join(generalDelim.trim() + " ") + 
      generalDelim.trim() + " " + lastDelim.trim() + " " + arr[arr.length - 1];
  }
}

function updateScore(board, scores) {
  if (detectWinner(board) === "Player") {
    scores.playerScore += 1;
  } else if (detectWinner(board) === "Computer") {
    scores.computerScore += 1;
  } else {
    scores.ties += 1;
  }
}

function displayScore(scores) {
  console.log(
` 
Computer: ${scores.computerScore}, Player: ${scores.playerScore}, Ties ${scores.ties}
(first to ${GAMES_REQUIRED_TO_WIN} wins match)
 `)
}


while (true) { // this loop starts a new match
let scores = { // store these in an object so that updateScore function can reference the same object on each loop
  computerScore: 0,
  playerScore: 0,
  ties: 0
}
let matchAnswer;
let gameAnswer;

while (true) { // this loop starts a new game
  let board = initializeBoard();

  while (true) { // this loop runs until there is a winner for the game, or the board is full

  
    displayBoard(board);
  
    playerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;

    computerChoosesSquare(board);
    if (someoneWon(board) || boardFull(board)) break;
  }

  displayBoard(board);

  if (someoneWon(board)) {
    prompt(`${detectWinner(board)} won!`);
  } else {
    prompt("It's a tie!");
  }

  updateScore(board, scores);
  displayScore(scores);

  
  if (scores.computerScore < GAMES_REQUIRED_TO_WIN && scores.playerScore < GAMES_REQUIRED_TO_WIN) {


  prompt("Play new game? (y or n)");
  gameAnswer = rlSync.question().toLowerCase()[0];}
  // if answer is yes, reset scores for a new match to 5
  
  
  if (gameAnswer !== 'y') break;
  if (scores.computerScore >= GAMES_REQUIRED_TO_WIN || scores.playerScore >= GAMES_REQUIRED_TO_WIN) break;

}
  prompt("Play new match? (y or n)");
  matchAnswer = rlSync.question().toLowerCase()[0];
  if (matchAnswer !== 'y') break;
  

}

prompt ('Thanks for playing Tic Tac Toe!')
