const SHUFFLE = require('shuffle-array');
const rlSync = require('readline-sync');


class Deck {
  constructor() {
    this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    this.current = [];
  }

  createUnshuffledDeck() {
    this.current = [];
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
    return SHUFFLE.pick(this.current);
  }

  removeDealtCard(card) {
    this.current.splice(this.current.indexOf(card), 1);
  }

  dealInitialCards(playerHand, dealerHand) {
    let playerCard1 = this.dealOneCard();
    playerHand.push(playerCard1);
    this.removeDealtCard(playerCard1);

    let dealerCard1 = this.dealOneCard();
    dealerHand.push(dealerCard1);
    this.removeDealtCard(dealerCard1);

    let playerCard2 = this.dealOneCard();
    playerHand.push(playerCard2);
    this.removeDealtCard(playerCard2);

    let dealerCard2 = this.dealOneCard();
    dealerHand.push(dealerCard2);
    this.removeDealtCard(dealerCard2);
  }

  determineCardValue(card, participantHandValue) {
    card = card.split(" ")[0];
    if (card >= 2 && card <= 10) {
      return Number(card);
    } else if (card === "Ace") {
      if (participantHandValue <= 10) {
        return 11;
      } else return 1;
    } else return 10; // face cards
  }
}

class Participant {
  constructor() {
    this.currentHand = [];
    this.currentHandValue = 0;
  }

  updateHandValue(deckObject) {
    let newValue = 0;

    this.currentHand.forEach(card => {
      newValue += deckObject.determineCardValue(card, newValue);
    });

    this.currentHandValue = newValue;
  }

  updateHand(card) {
    this.currentHand.push(card);
  }

  resetHandAndHandValue() {
    this.currentHand = [];
    this.currentHandValue = 0;
  }

  resetMoney() {
    this.money = this.startingMoney;
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.startingMoney = 5;
    this.money = 5;
    this.poorValue = 0;
    this.richValue = 10;
    this.choice = 'hit';
  }

  hit() {
    this.choice = 'hit';
  }

  stay() {
    this.choice = 'stay';
  }

  isBusted(bustValue) {
    return this.currentHandValue >= bustValue;
  }

  brokeOrRich() {
    return this.money <= this.poorValue || this.money >= this.richValue;
  }

  playerChoice() {
    console.log(" ");
    let choice = rlSync.question("Type \"s\" to stay, or \"h\" to hit: ").trim().toLowerCase();
    while (choice !== "s" && choice !== "h") {
      choice = rlSync.question("Invalid choice. Type \"s\" to stay, or \"h\" to hit: ").trim().toLowerCase();
    }
    if (choice === "s") {
      this.choice = "stay";
      console.log(" ");
    }
  }

  resetPlayerChoice() {
    this.choice = 'hit';
  }

  updatePlayerMoney(winStatus) {
    if (winStatus === "player bust") {
      this.money -= 1;
    } else if (winStatus === "dealer bust") {
      this.money += 1;
    } else if (winStatus === "player high score") {
      this.money += 1;
    } else if (winStatus === "dealer high score") {
      this.money -= 1;
    }
  }

  displayPlayerMoney() {
    console.log(`Player has ${this.money} dollar(s) remaining.`);
  }

  displayFinancialFinale() {
    if (this.money === 0) {
      console.log("You're out of money. Game over.");
    } else if (this.money === 10) {
      console.log("You're rich (10 whole dollars)! Enjoy your winnings.");
    }
  }
}

class Dealer extends Participant {

  constructor() {
    super();
    this.minValue = 17;
  }

  dealerWantsToHit(playerObject, bustValue) {
    return this.currentHandValue < this.minValue &&
    playerObject.currentHandValue < bustValue;
  }

  seeNextHit() {
    console.log(" ");
    let ready = rlSync.question("Dealer wants to hit. Enter 'r' when 'ready' to see the result: ").trim().toLowerCase();
    while (ready !== 'r') {
      ready = rlSync.question("Com'on, the suspense is killing us! Enter 'r' when 'ready': ").trim().toLowerCase();
    }
  }
}

class TwentyOneGame {
  constructor() {
    this.bustValue = 22;
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  start() {

    while (this.acceptRules()) {
      this.matchInitialization();

      while (true) {
        console.clear();
        this.roundInitialization();

        this.playerGameplay();
        this.dealerGameplay();

        this.roundResults();

        if (this.player.brokeOrRich() === true) break;
        if (this.readyForNextRound() === false) break;
      }

      this.matchResults();
      if (this.playNewMatch() === false) break;
    }
    this.displayGoodbyeMessage();
  }

  roundInitialization() {
    this.deck.current = this.deck.initializeShuffledDeck();
    this.player.resetHandAndHandValue();
    this.dealer.resetHandAndHandValue();
    this.player.resetPlayerChoice();
    this.deck.dealInitialCards(this.player.currentHand, this.dealer.currentHand); // eslint-disable-line max-len
    this.player.updateHandValue(this.deck);
    this.dealer.updateHandValue(this.deck);
  }

  matchInitialization() {
    this.player.resetMoney();
  }

  playerGameplay() {
    while (true) {
      this.displayGameState(true);
      this.player.displayPlayerMoney();
      this.player.playerChoice();
      if (this.player.choice === 'stay') break;

      let newCard = this.deck.dealOneCard();
      this.deck.removeDealtCard(newCard);
      this.player.updateHand(newCard);
      this.player.updateHandValue(this.deck);
      if (this.player.isBusted(this.bustValue) === true) break; // sometimes it is not accepting my choice to hit;
    }
  }

  dealerGameplay() {
    while (this.dealer.dealerWantsToHit(this.player, this.bustValue)) { // eslint-disable-line max-len
      this.displayGameState(false);

      this.dealer.seeNextHit();
      let newCard = this.deck.dealOneCard();
      this.deck.removeDealtCard(newCard);
      this.dealer.updateHand(newCard);
      this.dealer.updateHandValue(this.deck);
    }
  }

  roundResults() {
    this.displayGameState(false);
    this.displayWinner(this.determineWinner());
    this.player.updatePlayerMoney(this.determineWinner());
    this.player.displayPlayerMoney();
  }

  matchResults() {
    if (this.matchCompleted()) {
      console.clear();
      this.displayGameState(false);
      this.displayWinner(this.determineWinner());
      this.player.displayFinancialFinale();
    }
  }

  matchCompleted() {
    return this.player.money <= this.player.poorValue ||
    this.player.money >= this.player.richValue;
  }

  acceptRules() { // eslint-disable-line max-lines-per-function
    console.clear();
    console.log(`Welcome to ${this.bustValue - 1}!
    
  Rules: This is a card game, using a 52 card deck.
  The game is made up of rounds, that make up a match.
  
  Player or computer will lose a round automatically
  ("bust") if their score exceeds ${this.bustValue - 1}. Player goes
  first, and will get dealt additional cards ("hit") until
  they either choose to stop being dealt cards ("stay"),
  or until they "bust." Assuming the player has not "busted",
  the computer will then "hit" until it reaches a score
  of at least ${this.dealer.minValue}, or "busts." Ties are possible.

  You will begin each match with ${this.player.startingMoney} dollars. You will
  gain 1 dollar for each round you win, and lose 1 dollar
  for each round you lose (ties have no effect). A match
  will end when the player is rich (${this.player.richValue} dollars) or
  poor (${this.player.poorValue} dollars).
    
  Are you ready to play (y/n)?`);
    let ready = rlSync.prompt().trim().toLowerCase();
    while (ready !== "y" && ready !== "n") {
      ready = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase();
    }
    return (ready === "y");
  }

  displayGameState(isHumanTurn) {
    console.log('-------------');
    let humanCards = this.constructCurrentHand(this.player);
    let dealerCards = this.constructCurrentHand(this.dealer);

    if (isHumanTurn) {
      console.log(`Dealer has: ${this.dealer.currentHand[0]} and an unknown card.
You have: ${humanCards} (total value: ${this.player.currentHandValue})`);
    } else {
      console.log(`Dealer has: ${dealerCards} (total value: ${this.dealer.currentHandValue})
You have: ${humanCards} (total value: ${this.player.currentHandValue})`);
    }
  }

  constructCurrentHand(participant) {
    let currentHand = "";
    for (let card = 0; card < participant.currentHand.length - 1; card += 1) {
      if (card === 0) {
        currentHand += participant.currentHand[card];
      } else if (card > 0) {
        currentHand += ", " + participant.currentHand[card];
      }
    }
    currentHand += " and " + participant.currentHand[[participant.currentHand.length - 1]];
    return currentHand;
  }

  determineWinner() {
    if (this.player.currentHandValue > 21) {
      return "player bust";
    } else if (this.dealer.currentHandValue > 21) {
      return "dealer bust";
    } else if (this.player.currentHandValue > this.dealer.currentHandValue) {
      return "player high score";
    } else if (this.player.currentHandValue < this.dealer.currentHandValue) {
      return "dealer high score";
    } else return "tie";
  }

  displayWinner(winStatus) {
    if (winStatus === "player bust") {
      console.log("=> Player busts, dealer wins.");
    } else if (winStatus === "dealer bust") {
      console.log("=> Dealer busts, player wins.");
    } else if (winStatus === "player high score") {
      console.log("=> Player wins with higher score.");
    } else if (winStatus === "dealer high score") {
      console.log("=> Dealer wins with higher score.");
    } else if (winStatus === "tie") {
      console.log("=> It's a tie.");
    }
    console.log(" ");
  }

  displayGoodbyeMessage() {
    console.clear();
    console.log("Thanks for playing 21!");
    console.log(" ");
  }

  readyForNextRound() {
    console.log('-------------');
    let ready = rlSync.question("Are you ready for the next round (y/n)? ").trim().toLowerCase();
    while (ready !== "y" && ready !== "n") {
      ready = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase();
    }
    return ready === "y";
  }

  playNewMatch() {
    console.log('-------------');
    let playAgain = rlSync.question("Would you like to play a new match (y/n)? ").trim().toLowerCase();
    while (playAgain !== "y" && playAgain !== "n") {
      playAgain = rlSync.question("Invalid choice. Please enter \"y\" or \"n\": ").trim().toLowerCase();
    }
    return playAgain === "y";
  }
}

let game = new TwentyOneGame();
game.start();