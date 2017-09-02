$(document).ready(function(){
  canvas = prepareCanvas();

  $("#show-data").click(function(){
    canvas = prepareCanvas();

    var year = (document).getElementById("select-year").value;
    var month = (document).getElementById("select-month").value;
    var days = (document).getElementById("select-day").value;
    var day = +month + +days;

    //add 1 to day since values in drop-down start on 0, DB starts on 1
    asyncGetDataFromTable("magnetometer", year, day+1);
    calculateTimeIntervalAndDraw(canvas, year, day);
  });

  $("#select-year").change(function(){
    showCorrectDates();
  });
  $("#select-month").change(function(){
    showCorrectDates();
  });

});
