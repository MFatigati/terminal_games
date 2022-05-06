const rlSync = require("readline-sync");

function displayStartingRules() {
  console.clear();
  let acceptTerms = rlSync.question(`Welcome to Tic Tac Toe!

To determine the starting player, the program will--randomly--either assign "player" or "computer" as the starting player, or ask you to choose. Do you want to begin? (enter "yes" or "no"): `)
  acceptTerms = acceptTerms.trim()[0].toLowerCase();

  while (acceptTerms !== "y" && acceptTerms !== "n") {
    acceptTerms = rlSync.question(`Invalid choice. Please enter "yes" or "no": `)
  }

  if (acceptTerms === "y") {
    return true;
  } else return false;
}

console.log(displayStartingRules());