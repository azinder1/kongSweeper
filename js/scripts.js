//Back end logic
function Board() {
  this.grid = [];
  this.adjacentBlanks = [];
  this.checked =  [];
  this.toBeRevealed = [];
  this.revealedSquares=[];
  this.placedFlags = [];
  this.bombsRemaining;
  this.squaresRemaining;
  this.flagsRemaining;
  this.gridWidth;
  this.gameOver = false;
  this.revealedSquares=[];
  this.images = ["img/banana1.png","img/mine1.png","img/mine2.png","img/mine3.png","img/mine4.png","img/mine5.png","img/mine6.png","img/mine7.png","img/mine8.png","img/barrel.png", "img/explosion.png", "img/mineFlag.png"];
  this.userFlagSelect = false;
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

Board.prototype.resetGrid = function() {
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

Board.prototype.updateUI = function() {
  $(".grid").empty();
  for (row = 0; row < this.gridWidth; row++) {
    $(".grid").append('<div class="row gridRow" id="row' + row.toString() + '"></div>');
    for (column = 0; column < this.gridWidth; column++) {
      var squareCoordinateID = "#" + row.toString() + "-" + column.toString()
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString() + "-"  + column.toString() + '">'+'<img class = "gridSquare" src="img/mineBlankRed.png" alt="square" /></div>');
      $(squareCoordinateID).click(function() {
        var squareCoordinateID = this.id.split("-");
        var clickedSquareObject = gameBoard.grid[squareCoordinateID[0]][squareCoordinateID[1]];

        //if user is clearing mines
        if (!gameBoard.gameOver && !gameBoard.userFlagSelect) {
          //game over
          if (clickedSquareObject.hasBomb) {
            gameBoard.revealOneSquare(clickedSquareObject);
            gameBoard.gameOver = true;
            gameBoard.revealAllBombs();
            console.log("game over");
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

            //if user is placing flags
        } else if (!gameBoard.gameOver && gameBoard.userFlagSelect) {
          gameBoard.placeFlag(clickedSquareObject);
        }
      });
    }
  }
}

Board.prototype.placeFlag = function(squareObject) {
  if (squareObject.hasFlag) {
    this.bombsRemaining++;
    this.squaresRemaining++;
    this.flagsRemaining++;
    $("#" + squareObject.coordinateString).find("img").attr("src", "img/mineBlankRed.png");
    squareObject.hasFlag = false;
  } else if (!squareObject.hasFlag) {
    this.bombsRemaining--;
    this.squaresRemaining--;
    this.flagsRemaining--;
    $("#" + squareObject.coordinateString).find("img").attr("src", "img/mineFlag.png");
    squareObject.hasFlag = true;
  // this.checkForVictory();
  }
}

Board.prototype.revealAllBombs = function() {
  this.grid.forEach(function(row) {
    row.forEach(function(squareObject) {
      if (squareObject.hasBomb) {
        $("#" + squareObject.coordinateString).find("img").attr("src", "img/explosion.jpg");
      }
    })
  })
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
          if (squareToCheck.value === 0) {
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

Board.prototype.loopThroughBoard = function() {
  for (var i = 0; i < this.adjacentBlanks.length; i++) {
    if (this.checked.indexOf(this.adjacentBlanks[i].toString()) === -1) {
      this.checked.push(this.adjacentBlanks[i].toString());
      this.pushAdjacents([this.adjacentBlanks[i][0], this.adjacentBlanks[i][1]]);
    }
  }
}

Board.prototype.assignImages = function(coordinates) {
  var row = parseInt(coordinates[0]);
  var column = parseInt(coordinates[1]);
  var squareObject = this.grid[row][column];
  if (!squareObject.hasFlag)  {
    var attribute = this.images[squareObject.value];
  }
  else {
    var attribute = "img/mineFlag.png";
    console.log("already flagged");
  }
  return attribute;
};

Board.prototype.revealSquares = function() {
  for (squareIndex = 0; squareIndex < this.toBeRevealed.length; squareIndex++) {
    var squareString = this.toBeRevealed[squareIndex].join("-");
    if(this.revealedSquares.indexOf(squareString) === -1) {
      this.revealedSquares.push(squareString);
      this.squaresRemaining--;
    }
    $("#" + this.toBeRevealed[squareIndex][0] + "-" + this.toBeRevealed[squareIndex][1]).find("img").attr("src", this.assignImages(this.toBeRevealed[squareIndex]));

    this.checkForVictory();
  }
}

Board.prototype.revealOneSquare = function(squareObject) {
  // $("#" + coordinates[0] + "-" + coordinates[1]).find("img").hide();
  // this.assignImages(coordinates);
  $("#" + squareObject.coordinateString).find("img").attr("src", this.assignImages(squareObject.coordinates));
  if (this.revealedSquares.indexOf(squareObject.coordinateString) === -1) {
    this.revealedSquares.push(squareObject.coordinateString);
    this.squaresRemaining--;
  }
  squareObject.isRevealed = true;
}

Board.prototype.clearArray = function() {
  this.adjacentBlanks.length = 0;
  this.checked.length = 0;
  this.toBeRevealed.length = 0;
}

Board.prototype.checkForVictory = function() {
  // this.squaresRemaining--;
  if (this.squaresRemaining === this.bombsRemaining){
    this.gameOver = true;
    console.log("victory");
  }
}

var gameBoard = new Board();
$(function() {
  $("form").submit(function(event) {
    event.preventDefault();
    var gridWidth = parseInt($("#gridDimension").val());

    gameBoard.gridWidth = gridWidth;
    gameBoard.bombsRemaining = Math.floor(gridWidth * gridWidth * 0.1);
    gameBoard.squaresRemaining = gridWidth*gridWidth;
    gameBoard.flagsRemaining = gameBoard.bombsRemaining;
    gameBoard.resetGrid();
    gameBoard.placebombs();
    gameBoard.setbombWarnings();
    gameBoard.updateUI();
  });

  $("#flagButton").click(function() {
      gameBoard.userFlagSelect = true;
  })
  $("#revealButton").click(function() {
      gameBoard.userFlagSelect = false;
  })
})
