function generateWinningNumber() {
    return (Math.floor((Math.random() * 100) + 1));
}

function shuffle(array) {
    var m = array.length;
    while (m) {
        var randomNumber = Math.floor(Math.random() * m--);

        var holder = array[m];
        array[m] = array[randomNumber];
        array[randomNumber] = holder;
    }
    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    if (this.playersGuess > this.winningNumber) {
        return this.playersGuess - this.winningNumber;
    } else {
        return this.winningNumber - this.playersGuess
    }
}

Game.prototype.isLower = function () {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function (num) {
    if (num < 1 || num > 100 || isNaN(num)) {
        throw "That is an invalid guess.";
    } else {
        this.playersGuess = num;
    }
    return this.checkGuess();
}


// Game.prototype.checkGuess = function () {
//     if (this.playersGuess === this.winningNumber) {
//         return "You Win!";
//     }
//     if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
//         return "You have already guessed that number.";
//     } else {
//         this.pastGuesses.push(this.playersGuess);
//     }
//     if (this.winningNumber !== this.playersGuess && this.pastGuesses.length === 5) {
//         return "You Lose.";
//     } else if (this.difference() < 10) {
//         return "You're burning up!";
//     } else if (this.difference() < 25) {
//         return "You're lukewarm.";
//     } else if (this.difference() < 50) {
//         return "You're a bit chilly.";
//     } else {
//         return "You're ice cold!"
//     }
// }

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop("disabled", true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!'
    }
    else {
        if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
            $('#title').text("You've guessed this already!");
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled", true);
                $('#subtitle').text("Press the Reset button to play again!")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if (this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if (diff < 10) return 'You\'re burning up!';

                else if (diff < 25) return 'You\'re lukewarm.';

                else if (diff < 50) return 'You\'re a bit chilly.';

                else return 'You\'re ice cold!';

            }
        }
    }
}

var newGame = function () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);


}

function makeAGuess(game) {
    var guess = +$('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(guess);
    $('#title').text(output);
}


$(document).ready(function () {
    var game = new Game();
    $('#submit').on('click', function () {
        makeAGuess(game);
    })
    $('#player-input').on('keypress', function (event) {
        if (event.which == 13) {
            makeAGuess(game);
        }
    })
    $('#hint').on('click', function () {
        var hints = game.provideHint();
        $('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
    });

    $('#reset').on('click', function () {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
    })
});

