//
// Javascript file to drive the Hangman Game
//

var MISSESALLOWED = 9;

var nWins = 0;
var nLosses = 0;
var nMisses = 0;

var PuzzlePhrases = [ "WONT GET FOOLED AGAIN",
                      "WHO ARE YOU",
                      "ODDS AND SODS",
                      "TOMMY",
                      "QUADROPHENIA",
                      "THE WHO BY NUMBERS",
                      "MEATY BEATY BIG AND BOUNCY" ];

var theAnswerIndex;
var theScreenAnswer;
var theAnswer;
var userText;
var aLettersMissed = [];
var bGameFinished = false;
var nIndex;

var scrnAnswerSoFar = document.getElementById( hiddenPhrase );
var scrnWins = document.getElementById( "Wins" );
var scrnLosses = document.getElementById( "Losses" );
var scrnGuessesLeft = document.getElementById( "GuessesLeft" );
var scrnLettersMissed = document.getElementById( "missesSoFar" );

function isLetter( userChar ) {
  return userChar.length && ( userChar.match( /[a-z]/i ));
}

function resetForNewGame() {
  nGuesses = 0;

  // Find a new song!!
  theAnswerIndex = Math.floor( Math.random() * PuzzlePhrases.length );
  theAnswer = PuzzlePhrases[ theAnswerIndex ];

  // Now build up the initial string for "working" field on the screen..
  theScreenAnswer = '';
  for ( nIndex = 0; nIndex < theAnswer.length; nIndex++ ) {
    if ( theAnswer[ nIndex ] != ' ' ) {
      theScreenAnswer += '_';
    } else {
        theScreenAnswer += ' ';
    }
  }

  aLettersGuessed = [];
}

function updateScreenFields() {
  scrnAnswerSoFar.textContent = theScreenAnswer;
  scrnWins.textContent = nWins;
  scrnLosses.textContent = nLosses;
  scrnGuessesLeft.textContent = MISSESALLOWED - nMisses;
  scrnLettersMissed.textContent = "";
  for ( nIndex = 0; nIndex < aLettersMissed.length; nIndex++ ) {
    if ( nIndex != 0 ) {
        scrnLettersMissed.textContent += ",";
    }
    scrnLettersMissed.textContent += aLettersMissed[ nIndex ];
  }
}

resetForNewGame();
updateScreenFields();

// Next, we give JavaScript a function to execute when onkeyup event fires.
document.onkeyup = function( event ) {
  userText = event.key;

  console.log( "userText: " + userText );

  // Check to see if the previous game finished and if so....
  if ( bGameFinished ) {
    resetForNewGame();
    updateScreenFields();
    return;
  }

  // Check to see if the letter the user entered is a letter that has already
  // been missed.  If so then just return and dont change anything.
  for ( nIndex = 0; nIndex < aLettersMissed.length; nIndex++ ) {
    if ( aLettersMissed[ nIndex ] === userText ) {
        return;
    }
  }

  // Check to see if the letter guessed is in the current album title
  // If it is?  Update those instances in scrnAnswerSoFar then see if the puzzle is solved.
  // If not solved, loop around for next input.. If solved?  Update stats, do something
  // special from that album and reset for next game.
  // If it isn't, add to aLettersMisssed, increment the nMisses count.  See if nMisses
  // equals the number of misses that are allowed - if so, they lost so tell them
  // about it and be ready for next game.
  var bFound = false;
  for ( nIndex = 0; nIndex < theAnswer.length; nIndex++ ) {
    if ( userText === theAnswer[ nIndex ] ) {
      theScreenAnswer[ nIndex ] = userText;
      bFound = true;
    }
  }

  if ( bFound ) {
    // Is the puzzle solved?
    var bFinished = true;  // Assume the best..
    for ( nIndex = 0; nIndex < theScreenAnswer.length; nIndex++ ) {
        // It's not solved if we still have instances of the underscore..
        if ( theScreenAnswer[ nIndex ] === '_' ) {
            // Not solved yet..
            bFinished = false;
        }
    }

    // Are we finished?
    if ( bFinished ) {
      nWins++;
      bGameFinished = true;
    }
  } else {
    aLettersMissed += userText;
    if ( aLettersMissed.length === MISSESALLOWED ) {
      // All done with this game..
      nLosses++;
      bGameFinished = true;
    }
  }

  updateScreenFields();
}
