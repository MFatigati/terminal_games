const rlSync = require("readline-sync");
const POSSIBLE_STARTING_PLAYERS = ["player", "computer", "choice"]

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

console.log(determineStartingPlayer())