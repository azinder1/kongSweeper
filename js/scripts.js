var gridWidth;

function Board() {
  this.grid = [];
  this.minesRemaining;
  this.width;
}

Board.prototype.placeMines = function() {
  var potentialLocations = [];

  for (row = 0; row < this.width; row++) {
    for (column = 0; column < this.width; column++) {
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
  for (row = 0; row < this.width; row++) {
    for (column = 0; column < this.width; column++) {
      //check for mine at that location
      if (this.grid[row][column] === "X") {
        //loop through adjacent squares
        for (rowAdjust = -1; rowAdjust < 2; rowAdjust++) {
          for (columnAdjust = -1; columnAdjust < 2; columnAdjust++) {
            //test to make sure the selected square is within the grid
            if ((row+rowAdjust >= 0) && (row+rowAdjust <= this.width-1) && (column+columnAdjust >= 0) && (column+columnAdjust <= this.width-1)) {
              console.log("count one");
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
  this.grid = [];
  for (row = 0; row < this.width; row++) {
    this.grid.push([]);
    for (column = 0; column < this.width; column++) {
      this.grid[row].push(0);
    }
  }
  clearArray(adjacentBlanks);
  clearArray(checked);
}

Board.prototype.updateUI = function() {
  $(".grid").empty();
  for (row = 0; row < this.width; row++) {
    $(".grid").append('<div class="row gridRow" id="row' + row.toString() + '"></div>');
    for (column = 0; column < this.width; column++) {
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString()  + column.toString() + '">'+this.grid[row][column]+'</div>');
        if (this.grid[row][column]) {
          $("#"+row.toString()+column.toString()).toggleClass("hasMine");
        }
      $("#" + row.toString() + column.toString()).click(function() {
        // $(this).toggleClass("coordinateHighlight");
        pushAdjacents(this.id);
        loopThroughBoard();
        clearArray(checked);
      })
    }
  }
}

var adjacentBlanks = [];
var adjacentSquares = [];
var checked =  [];

function pushAdjacents(coordinates) {
  var x = getX(coordinates);
  var y = getY(coordinates);
  up = [(x - 1), y]
  down = [(x + 1), y]
  left = [x, (y - 1)]
  right = [x, (y + 1)]

  if (isInBounds(up) === true && isNotMine(up) === true) {
    if (checked.indexOf("" + up) === -1) {
      adjacentBlanks.push(up);
    }
  }
  if (isInBounds(down) === true && isNotMine(down) === true) {
    if (checked.indexOf("" + down) === -1) {
      adjacentBlanks.push(down);
    }
  }
  if (isInBounds(left) === true && isNotMine(left) === true) {
    if (checked.indexOf("" + left) === -1) {
      adjacentBlanks.push(left);
    }
  }
  if (isInBounds(right) === true && isNotMine(right) === true) {
    if (checked.indexOf("" + right) === -1) {
      adjacentBlanks.push(right);
    }
  }
}

function loopThroughBoard() {
  for (var i = 0; i < adjacentBlanks.length; i++) {
    if (checked.indexOf("" + adjacentBlanks[i]) === -1) {
      checked.push("" + adjacentBlanks[i]);
      var coordinates = "" + adjacentBlanks[i][0] + adjacentBlanks[i][1];
      $("#" + coordinates).toggleClass("coordinateHighlight");
      pushAdjacents(coordinates);
    }
  }
}

function getX(id) {
  var x = parseInt(id.charAt(0));
  return x;
}

function getY(id) {
  var y = parseInt(id.charAt(1));
  return y;
}

function isNotMine(coordinates) {
  if (gameBoard.grid[coordinates[0]][coordinates[1]] != "X") {
    return true;
  } else {
    return false;
  }
}

function isNotNumber(coordinates) {
  if (gameBoard.grid[coordinates[0]][coordinates[1]] < 1) {
    return true;
  } else {
    return false;
  }
}

function isInBounds(coordinates) {
  if (coordinates[0] >= 0 && coordinates[0] < gameBoard.width &&
      coordinates[1] >= 0 && coordinates[1] < gameBoard.width) {
    return true;
  } else {
    return false;
  }
}

function clearArray(array) {
  array.length = 0;
}

var gameBoard = new Board();

$(function() {

  $("form").submit(function(event) {
    event.preventDefault();
    gridWidth = parseInt($("#gridDimension").val());

    gameBoard.width = gridWidth;
    gameBoard.minesRemaining = gridWidth;
    gameBoard.resetGrid();
    gameBoard.placeMines();
    gameBoard.setMineWarnings();
    gameBoard.updateUI();

  });
})
