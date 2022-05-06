const rlSync = require("readline-sync");
const INITIAL_MARKER = " ";
const HUMAN_MARKER = "X";
const COMPUTER_MARKER = "O";
const GAMES_REQUIRED_TO_WIN = 2;
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
  [1, 5, 9], [3, 5, 7]             // diagonals
];

let board = {
  1: 'X',
  2: ' ',
  3: 'X',
  4: ' ',
  5: ' ',
  6: ' ',
  7: ' ',
  8: 'O',
  9: ' ',
}

function detectImmediateThreat(board) {
  for (let line = 0; line < WINNING_LINES.length; line ++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    let threatCounter = 0;

    if (board[sq1] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (board[sq2] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (board[sq3] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (threatCounter > 1) {
      return line;
    }
}}

function stopImmediateThreat(board, threatenedLine) { 
  // function should assign square to computer marker needed to stop immediate threat
  // threatened line will be the return value of the detectImmediateThreat function
  let threatPossibilities = WINNING_LINES[threatenedLine];
  let threatenedSquare;

  for (let space = 0; space < threatPossibilities.length; space += 1) {
    let boardSpaceCheck = board[String(threatPossibilities[space])];
    if (boardSpaceCheck !== HUMAN_MARKER) {
      threatenedSquare = String(threatPossibilities[space]);
      board[threatenedSquare] = COMPUTER_MARKER;
    }
  }
  return board;
}

console.log(detectImmediateThreat(board))
console.log(stopImmediateThreat(board, detectImmediateThreat(board)))
