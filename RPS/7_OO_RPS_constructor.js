/* eslint-disable max-lines-per-function */

const readline = require('readline-sync');

function RPSGame() {
  this.human = new CreateHuman();
  this.computer = new CreateComputer();
  this.score = new CreateScore();
  this.rules = new CreateRules();
}

RPSGame.prototype = {
  
  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors. Goodbye!');
  },

  displayMatchStatus(gameWinner) {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    insertLineBreak();
    this.displayMoves(humanMove, computerMove);
    this.score.displayScore();
    this.displayGameWinner(gameWinner);

    if (this.score.human === 5 || this.score.computer === 5) {
      if (this.score.human === 5) {
        console.log(`You have 5. You win the match!`);
      } else {
        console.log(`Computer has 5. Computer wins the match!`);
      }
    }
  },

  displayMoves(humanMove, computerMove) {
    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);
  },

  displayGameWinner(gameWinner) {
    if (gameWinner === "human") {
      console.log('You win this game! (first to 5 wins match)');
    } else if (gameWinner === "computer") {
      console.log('Computer wins this game! (first to 5 wins match)');
    } else {
      console.log("It's a tie (first to 5 wins match)");
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  matchOver() {
    if (this.score.human === 5 || this.score.computer === 5) {
      return true;
    }
    return false;
  },

  play() {
    console.clear();
    this.displayWelcomeMessage();
    insertLineBreak();
    if (!this.rules.acceptInitialRules()) {
      this.displayGoodbyeMessage();
      return undefined;
    }
    console.clear();

    while (true) {
      insertLineBreak();
      this.human.choose();
      this.computer.choose();
      // note to self: each loop updates each player's movesHistory property,
      // whose value is an object, which is why the updates are retained over
      // the successive loops
      let humanMove = this.human.move;
      let computerMove = this.computer.move;
      //console.log(this.computerMove + "test");
      let gameWinner = this.rules.returnMoveWinner(humanMove, computerMove);

      this.human.updateMovesHistory();
      this.computer.updateMovesHistory();
      this.score.updateScore(gameWinner);
      this.computer.updateComputerWeightedChoices(humanMove, gameWinner,
        this.human.movesHistory, this.score, this.rules.winningCombos);

      this.displayMatchStatus(gameWinner);

      if (this.matchOver()) {
        insertLineBreak();
        if (!this.playAgain()) break;
        this.score.resetScore();
        console.clear();
      }
    }
    this.displayGoodbyeMessage();
    return undefined;
  }
};

RPSGame.prototype.constructor = RPSGame;

function CreateScore() {
  this.human = 0;
  this.computer = 0;
  this.ties = 0;
}

CreateScore.prototype = {
    totalGamesPlayed() {
      return this.human + this.computer + this.ties;
    },

    displayScore() {
      console.log(`Score => You: ${this.human}; Computer: ${this.computer}; Ties: ${this.ties}`);
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

CreateScore.prototype.constructor = CreateScore;

function CreatePlayer() {
    this.move = null;
    this.movesHistory = {
      rock: 0, paper: 0, scissors: 0, lizard: 0, Spock: 0
    };
  };

CreatePlayer.prototype.updateMovesHistory = function() {
  this.movesHistory[this.move] += 1;
}

function CreateComputer() {
  CreatePlayer.call(this);
  let rules = new CreateRules();
  this.computerWeightedChoices = rules.choices.slice();
}

CreateComputer.prototype = Object.create(CreatePlayer.prototype);

CreateComputer.prototype.constructor = CreateComputer;

CreateComputer.prototype.choose = function() {
      let randomIndex = Math.floor(Math.random() *
        this.computerWeightedChoices.length);
      this.move = this.computerWeightedChoices[randomIndex];
    };

CreateComputer.prototype.updateComputerWeightedChoices = function(playerMove, gameWinner,
      humanMovesHistory, score, winningCombos) {
      let totalMoves = score.totalGamesPlayed();
      let currentPlayerMoveOccurencesCount = humanMovesHistory[playerMove];
      let currentPlayerMoveOccurencesPercent =
        currentPlayerMoveOccurencesCount / totalMoves;

      if (gameWinner === 'human' && currentPlayerMoveOccurencesPercent >= .4 && currentPlayerMoveOccurencesCount >= 2) {
        for (let possibleComputerPriorityMove in winningCombos) {
          if (winningCombos[possibleComputerPriorityMove]
            .defeats.includes(playerMove)) {
            let computerPriorityMove = possibleComputerPriorityMove;
            this.computerWeightedChoices.push(computerPriorityMove);
          }
        }
      }
    };

/* let playa = new CreatePlayer();
let comp = new CreateComputer();
debugger */

function CreateHuman() {
  CreatePlayer.call(this);
}

CreateHuman.prototype = Object.create(CreatePlayer.prototype);
CreateHuman.prototype.constructor = CreateHuman;

CreateHuman.prototype.choose = function() {
      let choice;

      while (true) {
        choice = readline.question(`Please type 'rock', 'paper', 'scissors', 'lizard' or 'Spock' (or 'r', 'p', 's', 'l', 'Sp'): `);
        if (this.validChoice(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = this.returnFullChoice(choice);
    };

CreateHuman.prototype.validChoice = function(choice) {
      let validChoices = ['rock', 'paper', 'scissors', 'lizard', 'Spock', 'r', 'p', 's', 'l', 'Sp'];
      return validChoices.includes(choice);
    };

CreateHuman.prototype.returnFullChoice = function(choice) {
      let conversions = {
        r: 'rock',
        p: 'paper',
        s: 'scissors',
        l: 'lizard',
        Sp: 'Spock'
      };
      if (choice.length < 3) {
        return conversions[choice];
      } else return choice;
    };

function CreateRules() {
  this.choices = ['rock', 'paper', 'scissors', 'lizard', 'Spock'];
    // note to self: was able to make use of this `choices` array
    // rather than making it a global constant by calling the
    // function createRules in other objects
  this.winningCombos = {
      rock: {defeats: ['scissors', 'lizard']},
      paper: {defeats: ['rock', 'Spock']},
      scissors: {defeats: ['paper', 'lizard']},
      lizard: {defeats: ['Spock', 'paper']},
      Spock: {defeats: ['rock', 'scissors']}
    }
  }

CreateRules.prototype.returnMoveWinner = function (humanMove, computerMove) {
      if (this.winningCombos[humanMove].defeats.includes(computerMove)) {
        return "human";
      } else if (humanMove === computerMove) {
        return "tie";
      } else {
        return "computer";
      }
    };

CreateRules.prototype.acceptInitialRules = function() {
      console.log(`In the following take on the classic game Rock, Paper, Scissors, you will also be able to choose lizard and Spock. The winning combinations are as follows:`);
      insertLineBreak();
      for (let move in this.winningCombos) {
        console.log(`  ${move[0].toUpperCase()}${move.slice(1)}` + " defeats " + `${this.winningCombos[move].defeats[0]} & ${this.winningCombos[move].defeats[1]}`);
      }
      insertLineBreak();
      console.log(`At first the computer will choose at random, but if it notices you winning with same move too often, it will adapt.`);
      insertLineBreak();
      while (true) {
        let ready = readline.question(`Are you ready to begin? (y/n): `).toLowerCase()[0];
        while (ready !== "y" && ready !== "n") {
          ready = readline.question(`Please enter 'y' or 'n': `).toLowerCase()[0];
        }
        return ready === 'y';
      }
    };

function insertLineBreak() {
  console.log(" ");
}

let game = new RPSGame();
game.play();
