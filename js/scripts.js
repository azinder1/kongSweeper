//Back end logic
function Board() {
  this.grid = [];
  this.adjacentBlanks = [];
  this.checked =  [];
  this.toBeRevealed = [];
  this.revealedSquares=[];
  this.placedFlags = [];
  this.bombsRemaining;
  this.totalBombs;
  this.squaresRemaining;
  this.flagsRemaining;
  this.gridWidth;
  this.gameOver = false;
  this.revealedSquares=[];
  this.images = ["img/banana1.png","img/mine1.png","img/mine2.png","img/mine3.png","img/mine4.png","img/mine5.png","img/mine6.png","img/mine7.png","img/mine8.png","img/barrelCropped.png", "img/explosion.jpg", "img/questionMarkTransparent.png", "img/mineBlankRed.png"];
  this.userFlagSelect = false;
}

Board.prototype.assignImages = function(coordinates) {
  var row = parseInt(coordinates[0]);
  var column = parseInt(coordinates[1]);
  var squareObject = this.grid[row][column];
  if (squareObject.hasBomb){
    var attribute = this.images[10];
  }
  else if (!squareObject.hasFlag)  {
    var attribute = this.images[squareObject.value];
  }
  else {
    var attribute = this.images[11];
  }
  return attribute;
};

Board.prototype.cheat = function() {
  this.squaresRemaining = 0;
  this.bombsRemaining = 0;
  this.checkForVictory();
}

Board.prototype.checkForVictory = function() {
  // this.squaresRemaining--;
  if (this.squaresRemaining === this.bombsRemaining){
    this.gameOver = true;
    var highscore = parseInt($('#timer').html());
    timer.stopTimer();
    this.revealAllBombs(true);
    scoreboard.checkHighScore(highscore);
    scoreboard.displayHighScores();
    console.log("victory");
  }
}

Board.prototype.clearArray = function() {
  this.adjacentBlanks.length = 0;
  this.checked.length = 0;
  this.toBeRevealed.length = 0;
}

Board.prototype.loopThroughBoard = function() {
  for (var i = 0; i < this.adjacentBlanks.length; i++) {
    if (this.checked.indexOf(this.adjacentBlanks[i].toString()) === -1) {
      this.checked.push(this.adjacentBlanks[i].toString());
      this.pushAdjacents([this.adjacentBlanks[i][0], this.adjacentBlanks[i][1]]);
    }
  }
}

Board.prototype.placebombs = function() {
  var potentialLocations = [];

  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      potentialLocations.push(row.toString() + "-" + column.toString());
    }
  }
  for (bomb = 0; bomb < this.bombsRemaining; bomb++) {
    var locationIndex = Math.floor(Math.random() * potentialLocations.length);
    var randombomb = potentialLocations[locationIndex].split("-");
    var squareObject = this.grid[randombomb[0]][randombomb[1]];
    if (squareObject.hasBomb) {
      bomb--;
    } else {
      squareObject.value = "X";
      squareObject.hasBomb = true;
    }
  }
}

Board.prototype.placeFlag = function(squareObject) {
  if (squareObject.hasFlag && !squareObject.isRevealed) {
    this.bombsRemaining++;
    this.squaresRemaining++;
    this.flagsRemaining++;
    $("#" + squareObject.coordinateString).find("img").attr("src", "img/mineBlankRed.png");
    squareObject.hasFlag = false;
  } else if (!squareObject.hasFlag && !squareObject.isRevealed) {
    this.bombsRemaining--;
    this.squaresRemaining--;
    this.flagsRemaining--;
    $("#" + squareObject.coordinateString).find("img").attr("src", this.images[11]);
    squareObject.hasFlag = true;
  }
}

Board.prototype.pushAdjacents = function(coordinates) {
  var row = coordinates[0];
  var column = coordinates[1];

  for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
    for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
      var newCoordinates = [(row + rowAdjust), (column + columnAdjust)];
      if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.gridWidth-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.gridWidth-1)) {
        var squareToCheck = this.grid[newCoordinates[0]][newCoordinates[1]];
        if (!this.grid[row+rowAdjust][column+columnAdjust].hasBomb) {
          if (squareToCheck.value === 0 && !squareToCheck.hasFlag) {
            this.adjacentBlanks.push(newCoordinates);
            this.toBeRevealed.push(newCoordinates);
          } else if (squareToCheck.value > 0) {
            this.toBeRevealed.push(newCoordinates);
          }
        }
      }
    }
  }
}

Board.prototype.resetGrid = function() {
  timer.stopTimer();
  this.grid.length = 0;
  this.gameOver = false;
  this.revealedSquares.length = 0;
  for (row = 0; row < this.gridWidth; row++) {
    this.grid.push([]);
    for (column = 0; column < this.gridWidth; column++) {
      this.grid[row].push({coordinates: [row, column], coordinateString: row.toString() + "-" + column.toString(), value: 0, hasBomb: false, hasFlag: false, isRevealed: false});
    }
  }
}

Board.prototype.revealAllBombs = function(victory) {
  if (victory) {
    attribute = this.images[9]
  }
  else if(!victory) {
    attribute = this.images[9]
  }
  this.grid.forEach(function(row) {
    row.forEach(function(squareObject) {
      if (squareObject.hasBomb && !squareObject.isRevealed) {
        $("#" + squareObject.coordinateString).find("img").attr("src", attribute);
      }
    })
  })
}

Board.prototype.revealSquares = function() {
  for (squareIndex = 0; squareIndex < this.toBeRevealed.length; squareIndex++) {
    var squareString = this.toBeRevealed[squareIndex].join("-");
    if(this.revealedSquares.indexOf(squareString) === -1) {
      this.revealedSquares.push(squareString);
      this.squaresRemaining--;
    }
    $("#" + this.toBeRevealed[squareIndex][0] + "-" + this.toBeRevealed[squareIndex][1]).find("img").attr("src", this.assignImages(this.toBeRevealed[squareIndex]));
  }
  this.checkForVictory();
}

Board.prototype.revealOneSquare = function(squareObject) {
  // $("#" + coordinates[0] + "-" + coordinates[1]).find("img").hide();
  // this.assignImages(coordinates);
  if (squareObject.hasBomb) {
    $("#" + squareObject.coordinateString).find("img").attr("src", this.assignImages(squareObject.coordinates));
    squareObject.isRevealed = true;
  }
  else {
    $("#" + squareObject.coordinateString).find("img").attr("src", this.assignImages(squareObject.coordinates));
    if (this.revealedSquares.indexOf(squareObject.coordinateString) === -1) {
      this.revealedSquares.push(squareObject.coordinateString);
      this.squaresRemaining--;
    }
    squareObject.isRevealed = true;
  }
}

//add bomb warning numbers to grid
Board.prototype.setbombWarnings = function() {
  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      var squareObject = this.grid[row][column];
      if (squareObject.hasBomb) {
        for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
          for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
            if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.gridWidth-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.gridWidth-1)) {
              var squareToIncrement = this.grid[row+rowAdjust][column+columnAdjust];
              if (!squareToIncrement.hasBomb) {
                squareToIncrement.value += 1;
              }
            }
          }
        }
      }
    }
  }
}

Board.prototype.updateUI = function() {
  $(".grid").empty();
  for (row = 0; row < this.gridWidth; row++) {
    $(".grid").append('<div class="row gridRow centerstuff" id="row' + row.toString() + '"></div>');
    for (column = 0; column < this.gridWidth; column++) {
      var squareCoordinateID = "#" + row.toString() + "-" + column.toString()
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString() + "-"  + column.toString() + '">'+'<img oncontextmenu="return false;" class = "gridSquare" src="'+ gameBoard.images[12] + '" alt="square" /></div>');
      // $(squareCoordinateID).click(function() {
      $(squareCoordinateID).mousedown(function(event) {
        var squareCoordinateID = this.id.split("-");
        var clickedSquareObject = gameBoard.grid[squareCoordinateID[0]][squareCoordinateID[1]];
        switch (event.which) {
          case 1:
          //if user is clearing mines
          if (!gameBoard.gameOver) {
            //game over
            if (!clickedSquareObject.hasFlag) {
              if (clickedSquareObject.hasBomb) {
              gameBoard.revealOneSquare(clickedSquareObject);
              gameBoard.gameOver = true;
              gameBoard.revealAllBombs(false);
              console.log("game over");
              timer.stopTimer();
              //only check clicked square
              } else if (clickedSquareObject.value > 0) {
                gameBoard.revealOneSquare(clickedSquareObject);
                gameBoard.checkForVictory();
                //run loop to find all connected blank squares
              } else {
                gameBoard.revealOneSquare(clickedSquareObject);
                gameBoard.pushAdjacents(clickedSquareObject.coordinates);
                gameBoard.loopThroughBoard();
                gameBoard.revealSquares();
                gameBoard.clearArray();
              }
            }
              //if user is placing flags
          }
            break;
          case 3:
            if (!gameBoard.gameOver) {
              gameBoard.placeFlag(clickedSquareObject);
            }
            break;
          default:
            break;
        }
        gameBoard.changeColor();
      })
    }
  }
  var heightofGrid = $('.grid').height();
  $('.grid').css({'width':heightofGrid+'px'});
  console.log("Grid Height: " + $('.grid').height());
  console.log("Grid Width: " + $('.grid').width());
}

function Scoreboard() {
  this.difficulty = 0.1;
  this.easyHighScore = {highScore: false, name: false};
  this.mediumHighScore = {highScore: false, name: false};
  this.hardHighScore = {highScore: false, name: false};
}

Scoreboard.prototype.checkHighScore = function(score) {
  if (this.difficulty === 0.1) {
    if (score < this.easyHighScore.highScore || !this.easyHighScore.highScore) {
      this.easyHighScore.highScore = score;
      this.easyHighScore.name = prompt("New High Score!\nPlease enter your name: ");
    }
  } else if (this.difficulty === 0.2) {
    if (score < this.mediumHighScore.highScore || !this.mediumHighScore.highScore) {
      this.mediumHighScore.highScore = score;
      this.mediumHighScore.name = prompt("New High Score!\nPlease enter your name: ");
    }
  } else if (this.difficulty === 0.3) {
    if (score < this.hardHighScore.highScore || !this.hardHighScore.highScore) {
      this.hardHighScore.highScore = score;
      this.hardHighScore.name = prompt("New High Score!\nPlease enter your name: ");
    }
  }
}

Scoreboard.prototype.displayHighScores = function() {
  $(".leaderboard").show();
  if (this.easyHighScore.highScore) {
    $(".easyHighScore").show();
    $("#easyHighScore").text(this.easyHighScore.highScore + " (" + this.easyHighScore.name + ")");
  }
  if (this.mediumHighScore.highScore) {
    $(".mediumHighScore").show();
    $("#mediumHighScore").text(this.mediumHighScore.highScore + " (" + this.mediumHighScore.name + ")");
  }
  if (this.hardHighScore.highScore) {
    $(".hardHighScore").show();
    $("#hardHighScore").text(this.hardHighScore.highScore + " (" + this.hardHighScore.name + ")");
  }
}

function Timer() {
  this.gameTimer;
  this.highScore;
}

Timer.prototype.startTimer = function() {
   var seconds = 0;
   this.gameTimer = setInterval(function() {
     $('#timer').text(seconds);
     seconds++; }, 1000);
}

Timer.prototype.stopTimer = function() {
  clearInterval(this.gameTimer);
}

Board.prototype.changeColor = function() {
  var ratio = gameBoard.bombsRemaining / gameBoard.totalBombs ;
  if (ratio > .2) {
    var variableRed = Math.round(50 * (1/ratio));
    var variableGreen = Math.round(5 * (1/ratio));
    var variableBlue =  Math.round(5 * (1/ratio));
    var variableColor = "rgb(" + variableRed + ", " + variableGreen + ", " + variableBlue + ")";
    $('.grid').css("background", "radial-gradient(" + variableColor + ", black");
    $('#title').css("color", variableColor);


  }
}

var gameBoard = new Board();
var timer = new Timer();
var scoreboard = new Scoreboard();

$(function() {
  $("#easy").toggleClass("clicked");
  $("#easy").click(function() {
    if (gameBoard.gameOver) {
      scoreboard.difficulty = 0.1;
      $("#easy").addClass("clicked");
      $("#medium").removeClass("clicked");
      $("#hard").removeClass("clicked");
      $("body").removeClass();
      $("body").addClass("easyBG");
    }
  })
  $("#medium").click(function() {
    if (gameBoard.gameOver) {
      scoreboard.difficulty = 0.2;
      $("#easy").removeClass("clicked");
      $("#medium").addClass("clicked");
      $("#hard").removeClass("clicked");
      $("body").removeClass();
      $("body").addClass("mediumBG");
    }
  })
  $("#hard").click(function() {
    if (gameBoard.gameOver) {
      scoreboard.difficulty = 0.3;
      $("#easy").removeClass("clicked");
      $("#medium").removeClass("clicked");
      $("#hard").addClass("clicked");
      $("body").removeClass();
      $("body").addClass("hardBG");
    }
  })
  $("form").submit(function(event) {
    $(".timer, .flags-remaining").show();
    event.preventDefault();

    $(".grid").removeClass("easyBorder mediumBorder hardBorder");
    $(".timer").show();

    if (scoreboard.difficulty === 0.1) {
      $(".grid").addClass("easyBorder");
    } else if (scoreboard.difficulty === 0.2) {
      $(".grid").addClass("mediumBorder");
    } else if (scoreboard.difficulty === 0.3) {
      $(".grid").addClass("hardBorder");
    }

    var gridWidth = parseInt($("#gridDimension").val());
    gameBoard.gridWidth = gridWidth;
    gameBoard.squaresRemaining = gridWidth*gridWidth;
    gameBoard.bombsRemaining = Math.floor(gameBoard.squaresRemaining * scoreboard.difficulty);
    gameBoard.totalBombs = gameBoard.bombsRemaining;
    gameBoard.flagsRemaining = gameBoard.bombsRemaining;
    gameBoard.resetGrid();
    gameBoard.placebombs();
    gameBoard.setbombWarnings();
    gameBoard.updateUI();
    timer.startTimer();
  });
})
