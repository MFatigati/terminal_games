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
  2: 'X',
  3: 'O',
  4: ' ',
  5: 'O',
  6: 'X',
  7: ' ',
  8: ' ',
  9: ' ',
}

function detectImmediateVictory(board) {
  for (let line = 0; line < WINNING_LINES.length; line ++) {
    let currentLineMarkers = WINNING_LINES[line].map(sq => board[sq])
    if (currentLineMarkers.filter(sq => sq === COMPUTER_MARKER).length === 2 &&
        currentLineMarkers.filter(sq => sq === HUMAN_MARKER).length === 0) {
          return line
    }
  }
}

console.log(detectImmediateVictory(board))