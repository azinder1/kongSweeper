
function Board() {
  this.grid = [];
  this.adjacentBlanks = [];
  this.checked =  [];
  this.toBeRevealed = [];
  this.minesRemaining;
  this.gridWidth;
  this.gameOver = false;
}

Board.prototype.placeMines = function() {
  var potentialLocations = [];

  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      potentialLocations.push(row.toString() + "-" + column.toString());
    }
  }
  for (mine = 0; mine < this.minesRemaining; mine++) {
    var locationIndex = Math.floor(Math.random() * potentialLocations.length);
    var randomMine = potentialLocations[locationIndex].split("-");
    this.grid[randomMine[0]][randomMine[1]] = "X";
  }
}

//add mine warning numbers to grid
Board.prototype.setMineWarnings = function() {
  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      if (this.grid[row][column] === "X") {
        for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
          for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
            if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.gridWidth-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.gridWidth-1)) {
              if (this.grid[row+rowAdjust][column+columnAdjust] != "X") {
                this.grid[row+rowAdjust][column+columnAdjust] += 1;
              }
            }
          }
        }
      }
    }
  }
}

Board.prototype.resetGrid = function() {
  this.clearArray();
  for (row = 0; row < this.gridWidth; row++) {
    this.grid.push([]);
    for (column = 0; column < this.gridWidth; column++) {
      this.grid[row].push(0);
    }
  }
}

Board.prototype.updateUI = function() {
  $(".grid").empty();
  for (row = 0; row < this.gridWidth; row++) {
    $(".grid").append('<div class="row gridRow" id="row' + row.toString() + '"></div>');
    for (column = 0; column < this.gridWidth; column++) {
      var squareCoordinateID = "#" + row.toString() + "-" + column.toString()
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString() + "-"  + column.toString() + '">'+this.grid[row][column]+'<img class = "gridSquare" src="img/square.png" alt="square" />'+'</div>');
        $('img').click(function() {
          $(this).hide();
        })
      $(squareCoordinateID).click(function() {
        var squareCoordinateID = this.id.split("-");
        if (gameBoard.grid[squareCoordinateID[0]][squareCoordinateID[1]] === "X") {
          //game over
          console.log("game over");
        } else if (parseInt(gameBoard.grid[squareCoordinateID[0]][squareCoordinateID[1]]) > 0) {
          //only check clicked square
          gameBoard.revealOneSquare(squareCoordinateID);
        } else {
          gameBoard.revealOneSquare(squareCoordinateID);
          gameBoard.pushAdjacents(squareCoordinateID);
          gameBoard.loopThroughBoard();
          gameBoard.revealSquares();
          gameBoard.clearArray();
        }
      })
    }
  }
}

Board.prototype.pushAdjacents = function(coordinates) {
  var row = parseInt(coordinates[0]);
  var column = parseInt(coordinates[1]);

  for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
    for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
      var newCoordinates = [(row + rowAdjust), (column + columnAdjust)];
      if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.gridWidth-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.gridWidth-1)) {
        if (this.grid[row+rowAdjust][column+columnAdjust] != "X") {
          if (this.grid[newCoordinates[0]][newCoordinates[1]] === 0) {
            this.adjacentBlanks.push(newCoordinates);
            this.toBeRevealed.push(newCoordinates);
          } else if (this.grid[newCoordinates[0]][newCoordinates[1]] > 0) {
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
      var coordinates = this.adjacentBlanks[i][0].toString() + "-" + this.adjacentBlanks[i][1].toString();
      this.pushAdjacents(coordinates.split("-"));
    }
  }
}

Board.prototype.revealSquares = function() {
  for (square = 0; square < this.toBeRevealed.length; square++) {
    $("#" + this.toBeRevealed[square][0] + "-" + this.toBeRevealed[square][1]).find("img").hide();
  }
}

Board.prototype.revealOneSquare = function(coordinates) {
  $("#" + coordinates[0] + "-" + coordinates[1]).find("img").hide();
}

Board.prototype.clearArray = function() {
  this.adjacentBlanks.length = 0;
  this.checked.length = 0;
  this.toBeRevealed.length = 0;
}


var gameBoard = new Board();
$(function() {

  $("form").submit(function(event) {
    event.preventDefault();
    var gridWidth = parseInt($("#gridDimension").val());

    gameBoard.gridWidth = gridWidth;
    gameBoard.minesRemaining = Math.floor(gridWidth * 2);
    gameBoard.resetGrid();
    gameBoard.placeMines();
    gameBoard.setMineWarnings();
    gameBoard.updateUI();
  });
})
