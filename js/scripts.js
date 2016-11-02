var gridWidth;


$(function() {
  $("form").submit(function(event) {
    event.preventDefault();
    gridWidth = parseInt($("#gridDimension").val());
    $(".grid").text("");

    for (i = 0; i < gridWidth; i++) {
      $(".grid").append('<div class="row gridRow" id="row' + i + '"></div>');
      for (j = 0; j < gridWidth; j++) {
        $("#row" + i).append('<div class="gridColumn" id="row' + i + 'col' + j + '">This is a column</div>');
        $("#row" + i + "col" + j).click(function() {
          $(this).toggleClass("coordinateHighlight");
        })
      }
    }
  });
})
