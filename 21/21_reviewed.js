/* 1. Initialize deck
2. Deal cards to player and dealer
3. Player turn: hit or stay
   - repeat until bust or stay
4. If player bust, dealer wins.
5. Dealer turn: hit or stay
   - repeat until total >= 17
6. If dealer busts, player wins.
7. Compare cards and declare winner. */
const rlSync = require("readline-sync");

const COMPUTER_MIN_VALUE = 17;
const BUST_VALUE = 22;

function createUnshuffledDeck() {
  let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  let unshuffledDeckArray = [];

  suits.forEach(suit => {
    values.forEach(value => {
      unshuffledDeckArray.push(`${value} of ${suit}`);
    });
  });
  return unshuffledDeckArray;
}

function initializeShuffledDeck(deck) {
  for (let index = deck.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [deck[index], deck[otherIndex]] = [deck[otherIndex], deck[index]]; // swap elements
  }
  return deck;
}

function generateRandomCard(deck) {
  let numCards = deck.length;
  let card = deck[Math.floor(Math.random() * numCards)]; // returns a number 0-51
  return card;
}

function determineCardValue(card, currentHandValue) {
  card = card.split(" ")[0];
  // console.log(card);
  if (card >= 2 && card <= 10) {
    return Number(card);
  } else if (card === "Ace") {
    if (currentHandValue <= 10) {
      return 11;
    } else return 1;
  } else return 10; // face cards
}

function updateHandValue(player, valuesObject, hands) {
  let newValue = 0;

  hands[player].forEach(card => {
    newValue += determineCardValue(card, newValue);
  });

  valuesObject[player] = newValue;
}

// the following version of updateHandValue does not work because it does not
// take into account the sum total
// of the preceding cards, leading to an error when an Ace leads to a bust
// improved version above
/* function updateHandValue(player, valuesObject, hands) {
  valuesObject[player] = hands[player]
  .map(determineCardValue).reduce((val, acc) => acc += val);
} */

function removeDealtCard(card, deck) {
  deck.splice(deck.indexOf(card), 1);
}


// in dealInitialCards and dealNewCard the program selects a random card
// from a shuffled deck, and then removes the selected cards. This works, but
// it doesn't quite reflect how actual dealing works, and it creates an
// unnecessary amount of randomness. Almost like shuffling again each deal
// LS version just deals first two from shuffled deck, then uses pop() to
// remove from them the beginning of the shuffled deck array.
function dealInitialCards(deck, hands) {
  let humanCard1 = generateRandomCard(deck);
  hands.human.push(humanCard1);
  removeDealtCard(humanCard1, deck);

  let computerCard1 = generateRandomCard(deck);
  hands.computer.push(computerCard1);
  removeDealtCard(computerCard1, deck);

  let humanCard2 = generateRandomCard(deck);
  hands.human.push(humanCard2);
  removeDealtCard(humanCard2, deck);

  let computerCard2 = generateRandomCard(deck);
  hands.computer.push(computerCard2);
  removeDealtCard(computerCard2, deck);
}

function dealNewCard(player, deck, hands) {
  let newCard = generateRandomCard(deck);
  hands[player].push(newCard);
}

function displayGameState(hands, values, isHumanTurn) {
  console.log('-------------');
  let humanCards = constructCurrentHand("human", hands);
  let computerCards = constructCurrentHand("computer", hands);

  if (isHumanTurn) {
    console.log(`Dealer has: ${hands.computer[0]} and an unknown card.
You have: ${humanCards} (total value: ${values.human})`);
  } else {
    console.log(`Dealer has: ${computerCards} (total value: ${values.computer})
You have: ${humanCards} (total value: ${values.human})`);
  }
}

function constructCurrentHand(player, hands) {
  let currentHand = "";
  for (let card = 0; card < hands[player].length - 1; card += 1) {
    if (card === 0) {
      currentHand += hands[player][card];
    } else if (card > 0) {
      currentHand += ", " + hands[player][card];
    }
  }
  currentHand += " and " + hands[player][[hands[player].length - 1]];
  return currentHand;
}

function determineWinner(valuesObject) {
  if (valuesObject.human > 21) {
    return "human bust";
  } else if (valuesObject.computer > 21) {
    return "computer bust";
  } else if (valuesObject.human > valuesObject.computer) {
    return "player high score";
  } else if (valuesObject.human < valuesObject.computer) {
    return "computer high score";
  } else return "tie";
}

function displayWinner(winStatus) {
  if (winStatus === "human bust") {
    console.log("=> Player busts, dealer wins.");
  } else if (winStatus === "computer bust") {
    console.log("=> Dealer busts, player wins.");
  } else if (winStatus === "player high score") {
    console.log("=> Player wins with higher score.");
  } else if (winStatus === "computer high score") {
    console.log("=> Computer wins with higher score.");
  } else if (winStatus === "tie") {
    console.log("=> It's a tie.");
  }
  console.log(" ");
}

function humanTurn(hands, values, deck) {
  let humanChoice = "hit";
  let bust = false;
  while (humanChoice === "hit" && bust === false) {
    displayGameState(hands, values, true);
    console.log(" ");
    let choice = rlSync.question("Type \"s\" to stay, or \"h\" to hit: ").trim().toLowerCase()[0];
    while (choice !== "s" && choice !== "h") {
      choice = rlSync.question("Invalid choice. Type \"s\" to stay, or \"h\" to hit: ").trim().toLowerCase()[0];
    }
    if (choice === "s") {
      humanChoice = "stay";
    } else {
      dealNewCard("human", deck, hands);
      updateHandValue("human", values, hands);
    }
    bust = busted(values);
    console.log(" ");
  }
}

function busted(valuesObject) {
  return valuesObject.human >= BUST_VALUE
}

function computerTurn(values, hands, deck) {
  while (values.computer < COMPUTER_MIN_VALUE && values.human < BUST_VALUE) {
    // Added second part of condition so that computer did not continue betting,
    // and accidentally bust, if the player had already busted. To make the
    // computer a little more aggressive, so that it bets when player has not
    // busted, but player score is still higher (even if the comp has already
    // reached 17), change condition to
    // ```values.computer < values.human && values.human < BUST_VALUE```
    // Would need to modify presentation of rules in startPlay to account for
    // this change
    dealNewCard("computer", deck, hands);
    updateHandValue("computer", values, hands);
    // maybe add feature to see next computer move? or to indicate what the computer has done?
  }
}

function playAgain() {
  console.log('-------------');
  let playAgain = rlSync.question("Would you like to play again (y/n)? ").trim().toLowerCase()[0];
  while (playAgain !== "y" && playAgain !== "n") {
    playAgain = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase()[0];
  }
  return playAgain === "y";
}

function startPlay() {
  console.clear();
  console.log(`Welcome to ${BUST_VALUE - 1}!
  
Rules: This is a card game, using a 52 card deck. Player or computer will lose automatically ("bust") if their score exceeds ${BUST_VALUE - 1}. Player goes first, and will get dealt additional cards ("hit") until they either choose to stop being dealt cards ("stay"), or until they "bust." Assuming the player has not "busted", the computer will then "hit" until it reaches a score of at least ${COMPUTER_MIN_VALUE}, or "busts." Ties are possible.
  
Are you ready to play (y/n)?`);
  let ready = rlSync.prompt().trim().toLowerCase()[0];
  while (ready !== "y" && ready !== "n") {
    ready = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase()[0];
  }
  if (ready === "n") {
    return false;
  } else return true;
}


let ready = startPlay();

while (ready) {
  let deck = initializeShuffledDeck(createUnshuffledDeck());
  let currentHands = {
    human: [],
    computer: []
  };

  let currentValues = {
    human: 0,
    computer: 0
  };

  dealInitialCards(deck, currentHands);
  updateHandValue("human", currentValues, currentHands);
  updateHandValue("computer", currentValues, currentHands);

  console.clear();

  humanTurn(currentHands, currentValues, deck);
  computerTurn(currentValues, currentHands, deck);

  displayGameState(currentHands, currentValues, false);
  console.log(" ");
  displayWinner(determineWinner(currentValues));

  ready = playAgain();
}
console.clear();
console.log("Thanks for playing 21!");
console.log(" ");