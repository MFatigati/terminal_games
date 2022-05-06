const SHUFFLE = require('shuffle-array');
const rlSync = require('readline-sync');

// class Card {
//   constructor() {
//       }

  
// }

class Deck {
  constructor() {
    this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    this.current = [];
  }

  createUnshuffledDeck() {
    this.suits.forEach(suit => {
      this.values.forEach(value => {
        this.current.push(`${value} of ${suit}`);
      });
    });
    return this.current;
  }

  initializeShuffledDeck() {
    return SHUFFLE(this.createUnshuffledDeck());
  }

  dealOneCard() {
    return SHUFFLE.pick(this.current)
  }

  removeDealtCard(card) {
    this.current.splice(this.current.indexOf(card), 1);
  }

  dealInitialCards(humanHand, computerHand) {
    let humanCard1 = this.dealOneCard();
    humanHand.push(humanCard1);
    this.removeDealtCard(humanCard1);
  
    let computerCard1 = this.dealOneCard();
    computerHand.push(computerCard1);
    this.removeDealtCard(computerCard1);
  
    let humanCard2 = this.dealOneCard();
    humanHand.push(humanCard2);
    this.removeDealtCard(humanCard2);
  
    let computerCard2 = this.dealOneCard();
    computerHand.push(computerCard2);
    this.removeDealtCard(computerCard2);
  }
}

class Participant {
  constructor() {
    this.currentHand = [];
    this.currentValue = 0;
    //STUB
    // What sort of state does a participant need?
    // Score? Hand? Amount of money available?
    // What else goes here? all the redundant behaviors from Player and Dealer?
  }

  updateHandValue() {
    let newValue = 0;
  
    this.currentHand.forEach(card => {
      newValue += this.determineCardValue(card, newValue);
    });
  
    this.currentValue = newValue;
  }

  determineCardValue(card, participantHandValue) {
    card = card.split(" ")[0];
    // console.log(card);
    if (card >= 2 && card <= 10) {
      return Number(card);
    } else if (card === "Ace") {
      if (participantHandValue <= 10) {
        return 11;
      } else return 1;
    } else return 10; // face cards
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.money = 5;
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted(bustValue) {
    return this.currentValue >= bustValue;
  }

  score() {
    //STUB
  }

  playerTurn(hands, values, deck) {
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
}

class Dealer extends Participant {
  // Very similar to a Player; do we need this?

  constructor() {
    super();
    //STUB
    // What sort of state does a dealer need?
    // Score? Hand? Deck of cards? Bow tie?
  }

  hit() {
    //STUB
  }

  stay() {
    //STUB
  }

  isBusted() {
    //STUB
  }

  score() {
    //STUB
  }

  hide() {
    //STUB
  }

  reveal() {
    //STUB
  }

  deal() {
    //STUB
    // does the dealer or the deck deal?
  }

  dealerTurn() {
    //STUB
  }
}

class TwentyOneGame {
  constructor() {
    this.bustValue = 22;
    this.computerMinValue = 17;
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  start() {
    let ready = this.startPlay();

    while (ready) {
      this.deck.current = this.deck.initializeShuffledDeck();
    
      this.deck.dealInitialCards(this.player.currentHand, this.dealer.currentHand);
      this.player.updateHandValue();
      this.dealer.updateHandValue();
    
      console.clear();
    
      this.player.humanTurn(currentHands, currentValues, this.deck);
      computerTurn(currentValues, currentHands, this.deck);
    
      displayGameState(currentHands, currentValues, false);
      console.log(" ");
      displayWinner(determineWinner(currentValues));
    
      ready = playAgain();
    }
    //SPIKE
    this.startPlay();
    this.dealCards();
    this.showCards();
    this.player.playerTurn();
    this.dealer.dealerTurn();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  displayGameState(hands, values, isHumanTurn) {
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
  
  constructCurrentHand(player, hands) {
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
  
  determineWinner(valuesObject) {
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
  
  displayWinner(winStatus) {
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

  startPlay() {
    console.clear();
    console.log(`Welcome to ${this.bustValue - 1}!
    
  Rules: This is a card game, using a 52 card 
  deck. Player or computer will lose automatically
  ("bust") if their score exceeds ${this.bustValue - 1}. Player goes
  first, and will get dealt additional cards
  ("hit") until they either choose to stop being
  dealt cards ("stay"), or until they "bust."
  Assuming the player has not "busted", the computer
  will then "hit" until it reaches a score of at
  least ${this.computerMinValue}, or "busts." Ties are possible.
    
  Are you ready to play (y/n)?`);
    let ready = rlSync.prompt().trim().toLowerCase()[0];
    while (ready !== "y" && ready !== "n") {
      ready = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase()[0];
    }
    if (ready === "n") {
      return false;
    } else return true;
  }

  displayGoodbyeMessage() {
    console.clear();
    console.log("Thanks for playing 21!");
    console.log(" ");
  }

  displayResult() {
    //STUB
  }
}

let game = new TwentyOneGame();
game.start();

let currentDeck = new Deck;