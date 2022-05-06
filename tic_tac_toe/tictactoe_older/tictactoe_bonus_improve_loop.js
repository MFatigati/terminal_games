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
const GAMES_REQUIRED_TO_WIN = 3;
const POSSIBLE_STARTING_PLAYERS = ["player", "computer", "choice"]
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
  [1, 5, 9], [3, 5, 7]             // diagonals
];

function displayBoard(board, startingPlayer) {
  console.clear()

  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}.
Starting for this game: ${startingPlayer}`)

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

function acceptStartingMethod() {
  console.clear();
  let acceptTerms = rlSync.question(`Welcome to Tic Tac Toe! Here are some ground rules:

Who goes first? For each individual game, the program will--randomly--either assign "player" or "computer" as the starting player, or ask you to choose.

How to win? A match is composed of games, and the match is won by whoever wins ${GAMES_REQUIRED_TO_WIN} games first.

Are you ready to begin? (enter "yes" or "no"): `)
  acceptTerms = acceptTerms.trim()[0].toLowerCase();

  while (acceptTerms !== "y" && acceptTerms !== "n") {
    acceptTerms = rlSync.question(`Invalid choice. Please enter "yes" or "no": `)
  }

  if (acceptTerms === "y") {
    return true;
  } else return false;
}

function determineStartingPlayer() {
  let playerChoice;
  let startingPlayer = POSSIBLE_STARTING_PLAYERS[Math.floor(Math.random()*POSSIBLE_STARTING_PLAYERS.length)]

  if (startingPlayer === "choice") {
  playerChoice = rlSync.question(`Choose starting player (enter 'p' for player, or 'c' for computer): `).trim()[0].toLowerCase();

  while (playerChoice !== "p" && playerChoice !== "c") {
    playerChoice = rlSync.question(`Invalid choice. Please enter 'p' for player, or 'c' for computer: `).trim()[0].toLowerCase();
  }

   if (playerChoice === "p") {
     startingPlayer = POSSIBLE_STARTING_PLAYERS[0];
   }
   if (playerChoice === "c") {
     startingPlayer = POSSIBLE_STARTING_PLAYERS[1];
   }

  }

  return startingPlayer;
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
  square = rlSync.prompt().trim();
  if (emptySquares(board).includes(square)) break;
  
  prompt("Sorry, that's not a valid choice.")
  
  }
  board[square] = HUMAN_MARKER;
}

function computerChoosesRandomSquare(board) {
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

function detectImmediateVictory(board) { // simplified code compared to detectImmediateThreat function
  for (let line = 0; line < WINNING_LINES.length; line ++) {
    let currentLineMarkers = WINNING_LINES[line].map(sq => board[sq])
    if (currentLineMarkers.filter(sq => sq === COMPUTER_MARKER).length === 2 &&
        currentLineMarkers.filter(sq => sq === HUMAN_MARKER).length === 0) {
          return line
    }
  }
}

function claimImmediateVictory(board, availableWinningLine) {
  // availableWinningLine will be the return value of the detectImmediateVictory function
  let winningLinePossibitlies = WINNING_LINES[availableWinningLine];
  let winningSquare;

  for (let space = 0; space < winningLinePossibitlies.length; space += 1) {
    let boardSpaceCheck = board[String(winningLinePossibitlies[space])];
    if (boardSpaceCheck !== COMPUTER_MARKER) {
      winningSquare = String(winningLinePossibitlies[space]);
      board[winningSquare] = COMPUTER_MARKER;
    }
  }
}

function detectImmediateThreat(board) {
  for (let line = 0; line < WINNING_LINES.length; line ++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    let threatCounter = 0;
    let occupiedByComputer = 0;

    if (board[sq1] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (board[sq1] === COMPUTER_MARKER) {
      occupiedByComputer += 1;
    }
    if (board[sq2] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (board[sq2] === COMPUTER_MARKER) {
      occupiedByComputer += 1;
    }
    if (board[sq3] === HUMAN_MARKER) {
      threatCounter += 1;
    }
    if (board[sq3] === COMPUTER_MARKER) {
      occupiedByComputer += 1;
    }

    if (threatCounter === 2 && occupiedByComputer === 0) {
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
}

function isFiveEmpty(board) {
  if (board["5"] === " ") {
    return true;
  }
}

function chooseFiveFirst(board) {
  if (board["5"] === " ") {
    board[5] = COMPUTER_MARKER;
  }
}

function computerChoosesSquare(board) {
  if (isFiveEmpty(board)) {
    chooseFiveFirst(board);
  } else if (detectImmediateVictory(board) !== undefined) {
    claimImmediateVictory(board, detectImmediateVictory(board))
  } else if (detectImmediateThreat(board) !== undefined) {
    stopImmediateThreat(board, detectImmediateThreat(board))
  } else {
    computerChoosesRandomSquare(board);
  } 
}

function detectWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line ++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

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

function chooseSquare(board, currentPlayer) {
  if (currentPlayer === "player") {
    playerChoosesSquare(board);
  } else if (currentPlayer === "computer") {
  computerChoosesSquare(board)
  }
}

function alternatePlayer(currentPlayer) {
  return currentPlayer === "player" ? "computer" : "player";
}

function displayMatchOver(scores) {
  for (let player in scores) {
    if (scores[player] === GAMES_REQUIRED_TO_WIN) {
      console.log(`=> ${convertScoretoDisplayName(player)} wins the match!`)
    }
  }
}

function convertScoretoDisplayName (scoreName) {
  if (scoreName === "computerScore") {
    return "Computer";
  } else if (scoreName === "playerScore") {
    return "Player";
  }
}

let acceptTerms = acceptStartingMethod();

if (acceptTerms) {

while (true) { // this loop starts a new match
let scores = {
  computerScore: 0,
  playerScore: 0,
  ties: 0
}
let matchAnswer;
let gameAnswer;

while (true) { // this loop starts a new game
  let board = initializeBoard();
  console.clear();

  let startingPlayer = determineStartingPlayer();
  let currentPlayer = startingPlayer;

  while (true) {
    displayBoard(board, startingPlayer);
    chooseSquare(board, currentPlayer);
    currentPlayer = alternatePlayer(currentPlayer); // why does the program still work with this commented out?
    if (someoneWon(board) || boardFull(board)) break;
  }

  displayBoard(board, startingPlayer);

  if (someoneWon(board)) {
    prompt(`${detectWinner(board)} won this game.`);
  } else {
    prompt("It's a tie!");
  }
  
  updateScore(board, scores);
  displayScore(scores);

  
  if (scores.computerScore < GAMES_REQUIRED_TO_WIN && scores.playerScore < GAMES_REQUIRED_TO_WIN) {


  prompt("Play new game? (y or n)");
  gameAnswer = rlSync.prompt().toLowerCase()[0];}
  // if answer is yes, reset scores for a new match to 5
  
  if (gameAnswer !== 'y') break;
  if (scores.computerScore >= GAMES_REQUIRED_TO_WIN || scores.playerScore >= GAMES_REQUIRED_TO_WIN) break;

}
  
  displayMatchOver(scores);
  prompt(" ")

  prompt("Play new match? (y or n)");
  matchAnswer = rlSync.prompt().toLowerCase()[0];
  while (matchAnswer !== 'y' && matchAnswer !== 'n') {
    matchAnswer = rlSync.question("Invalid choice. Please enter y or n: ").toLowerCase()[0];
  }
  if (matchAnswer !== 'y') break;
  
}
}
console.clear();
prompt ('Thanks for playing Tic Tac Toe!');
prompt(" ");
