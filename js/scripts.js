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
    this.grid[randomMine[0]][randomMine[1]] = 1;
  }
  console.log("grid: ", this.grid);
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
      $("#row" + row).append('<div class="gridColumn" id="' + row.toString()  + column.toString() + '">[]</div>');
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
    gameBoard.updateUI();

  });
})
