
function Board() {
  this.grid = [];
  this.adjacentBlanks = [];
  this.checked =  [];
  this.minesRemaining;
  this.gridWidth;
}

Board.prototype.placeMines = function() {
  var potentialLocations = [];

  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      potentialLocations.push(row.toString() + column.toString());
    }
  }
  for (mine = 0; mine < this.minesRemaining; mine++) {
    var locationIndex = Math.floor(Math.random() * potentialLocations.length);
    var randomMine = potentialLocations[locationIndex];
    this.grid[randomMine[0]][randomMine[1]] = "X";
  }
}

//add mine warning numbers to grid
Board.prototype.setMineWarnings = function() {
  //loop through grid
  for (row = 0; row < this.gridWidth; row++) {
    for (column = 0; column < this.gridWidth; column++) {
      //check for mine at that location
      if (this.grid[row][column] === "X") {
        //loop through adjacent squares
        for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
          for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
            //test to make sure the selected square is within the grid
            if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.gridWidth-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.gridWidth-1)) {
              //test to make sure the selected square doesn't also contain a mine
              if (this.grid[row+rowAdjust][column+columnAdjust] != "X") {
                //increment selected square by one
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
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString() + "-"  + column.toString() + '">'+this.grid[row][column]+'</div>');
        // if (this.grid[row][column]) {
        //   $("#"+row.toString()+column.toString()).toggleClass("hasMine");
        // }
      $(squareCoordinateID).click(function() {
        // $(this).toggleClass("coordinateHighlight");
        gameBoard.pushAdjacents(squareCoordinateID.slice(1, squareCoordinateID.length).split("-"));
        gameBoard.loopThroughBoard();
        gameBoard.clearArray();
      })
    }
  }
}

Board.prototype.pushAdjacents = function(coordinates) {
  var x = parseInt(coordinates[1]);
  var y = parseInt(coordinates[0]);
  up = [x, (y - 1)];
  down = [x, (y + 1)];
  left = [(x - 1), y];
  right = [(x + 1),y];

  if (this.isInBounds(up) === true && this.isNotBomb(up) === true) {
    if (this.checked.indexOf(up.toString()) === -1) {
      this.adjacentBlanks.push(up);
    }
  }
  if (this.isInBounds(down) === true && this.isNotBomb(down) === true) {
    if (this.checked.indexOf(down.toString()) === -1) {
      this.adjacentBlanks.push(down);
    }
  }
  if (this.isInBounds(left) === true && this.isNotBomb(left) === true) {
    if (this.checked.indexOf(left.toString()) === -1) {
      this.adjacentBlanks.push(left);
    }
  }
  if (this.isInBounds(right) === true && this.isNotBomb(right) === true) {
    if (this.checked.indexOf(right.toString()) === -1) {
      this.adjacentBlanks.push(right);
    }
  }
}

Board.prototype.loopThroughBoard = function() {
  for (var i = 0; i < this.adjacentBlanks.length; i++) {
    if (this.checked.indexOf(this.adjacentBlanks[i].toString()) === -1) {
      this.checked.push(this.adjacentBlanks[i].toString());
      var coordinates = this.adjacentBlanks[i][0].toString() + "-" + this.adjacentBlanks[i][1].toString();
      $("#" + coordinates).toggleClass("coordinateHighlight");
      this.pushAdjacents(coordinates.split("-"));
    }
  }
}

Board.prototype.isNotBomb = function(coordinates) {
  if (this.grid[coordinates[0]][coordinates[1]] != "X") {
    return true;
  } else {
    return false;
  }
}

Board.prototype.isInBounds = function(coordinates) {
  if (coordinates[0] >= 0 && coordinates[0] < this.gridWidth &&
      coordinates[1] >= 0 && coordinates[1] < this.gridWidth) {
    return true;
  } else {
    return false;
  }
}

Board.prototype.clearArray = function() {
  this.grid.length = 0;
}


var gameBoard = new Board();
$(function() {

  $("form").submit(function(event) {
    event.preventDefault();
    var gridWidth = parseInt($("#gridDimension").val());

    gameBoard.gridWidth = gridWidth;
    gameBoard.minesRemaining = gridWidth;
    gameBoard.resetGrid();
    gameBoard.placeMines();
    gameBoard.setMineWarnings();
    gameBoard.updateUI();

  });
})
