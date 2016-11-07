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
        $(this).toggleClass("coordinateHighlight");
      })
    }
  }
}



$(function() {
  var gameBoard = new Board();
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
