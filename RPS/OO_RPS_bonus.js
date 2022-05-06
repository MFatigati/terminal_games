const readline = require('readline-sync');
const CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'Spock'];

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  score: createScore(),
  rules: createRules(),
  // humanMove: RPSGame.human.move,

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  displayGameStatus() { // function both determines winner and displays winner; not ideal-- FIXED with returnMoveWinner
    let humanMove = this.human.move;
    let computerMove = this.computer.move;
    let gameWinner = this.rules.returnMoveWinner(humanMove, computerMove);
    this.score.updateScore(gameWinner);
    /* is it bad that I update the score in the middle
    of the display function? not sure how else to accomplish this
    if I move the humanMove variable outside of this method,
    it cannot access this.human.move*/

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);
    this.score.displayScore();
    console.log(this.human.movesHistory);
    console.log(this.computer.movesHistory);

    if (gameWinner === "human") {
      console.log('You win!');
    } else if (gameWinner === "computer") {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }

    if (this.score.human === 5 || this.score.computer === 5) {
      if (this.score.human === 5) {
        console.log(`You have 5. You win this match!`);
      } else {
        console.log(`Computer has 5. Computer wins this match!`);
      }
    }
  },
  // seemed like updateComputerWeightedChoices method fit best under the computer object,
  // but I needed to create a parallel function here in order to access the current moves;
  updateComputerWeightedChoicesInGame() {
    let gameWinner = this.rules.returnMoveWinner(this.human.move, this.computer.move);
    let totalMoves = this.score.human + this.score.computer + this.score.ties;
    let moveOccurences = this.human.movesHistory[this.human.move];
    let moveChosenPercentage = this.human.movesHistory[this.human.move] / totalMoves;
    console.log(moveChosenPercentage);
    if (gameWinner === 'human' && moveChosenPercentage >= .4 && moveOccurences >= 2) {
                                  // computer will consider a move favored, and thus try to
                                  // guard against it, if human has chosen it 40% of the time
                                  // and twice or more
      this.computer.updateComputerWeightedChoices(this.human.move, this.rules.winningCombos);
      console.log(this.computer.computerWeightedChoices);
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  matchOver() {
    if (this.score.human === 5 || this.score.computer === 5) {
      if (this.score.human === 5) {
        return true;
      } else {
        return true;
      }
    }
    return false;
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose(); // each loop updates this player's move property
      this.computer.choose();
      this.human.updateMovesHistory();
      this.computer.updateMovesHistory();
      this.displayGameStatus();
      this.updateComputerWeightedChoicesInGame();
      if (this.matchOver()) {
        if (!this.playAgain()) break;
        this.score.resetScore();
      }
    }
    this.displayGoodbyeMessage();
  }
};

function createScore() {
  return {
    human: 0,
    computer: 0,
    ties: 0,

    displayScore() {
      console.log(`You: ${this.human}; Computer: ${this.computer}; Ties: ${this.ties}`);
    },

    updateScore(gameWinner) {
      if (gameWinner === "human") {
        this.human += 1;
      } else if (gameWinner === "computer") {
        this.computer += 1;
      } else {
        this.ties += 1;
      }
    },

    resetScore() {
      this.human = 0;
      this.computer = 0;
      this.ties = 0;
    }
  };
}


function createPlayer() {
  return {
    move: null,
    movesHistory: {
      rock: 0, paper: 0, scissors: 0, lizard: 0, Spock: 0
    },
    updateMovesHistory() {
      this.movesHistory[this.move] += 1;
    }
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    computerWeightedChoices: CHOICES.slice(),

    choose() {
      let randomIndex = Math.floor(Math.random() * this.computerWeightedChoices.length);
      this.move = this.computerWeightedChoices[randomIndex];
    },
    // makes it more likely the comp will choose whatever 
    // move would have beaten the human move to which the computer just lost
    updateComputerWeightedChoices(playerMove, winningCombos) {
      for (let possibleComputerPriorityMove in winningCombos) {
        if (winningCombos[possibleComputerPriorityMove].includes(playerMove)) {
          let computerPriorityMove = possibleComputerPriorityMove;
          this.computerWeightedChoices.push(computerPriorityMove);
        }
      }
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {

    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, or scissors, lizard or Spock:');
        choice = readline.question();
        if (CHOICES.includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

/*
Everytime human wins
  add the choices that could have led to computer victory to computer's choices
*/

function createRules() {
  return {
    choices: ['rock', 'paper', 'scissors', 'lizard', 'Spock'], // can I make use of this, instead of the CHOICE constant?

    winningCombos: {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'Spock'],
      scissors: ['paper', 'lizard'],
      lizard: ['Spock', 'paper'],
      Spock: ['rock', 'scissors']
    },

    returnMoveWinner(humanMove, computerMove) {
      if (this.winningCombos[humanMove].includes(computerMove)) {
        return "human";
      } else if (humanMove === computerMove) {
        return "tie";
      } else {
        return "computer";
      }
    }

  };
}

RPSGame.play();
