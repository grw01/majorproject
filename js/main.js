$(document).ready(function(){
  canvas = prepareCanvas();
  /*CHANGE-NOTICE will be deleted after asyncGetDataFromTable is added to draw function or similar
  if((localStorage.getItem("magnetometer") == "") || (localStorage.getItem("magnetometer") == null)){
    console.log("magnetometer is null");
    //asyncGetDataFromTable("magnetometer");
    //CHANGE-NOTICE need to add other sources of data later
  }else{
    console.log("local magnetometer data is not null");
    //CHANGE-NOTICE will need to be modified to add the other sources in an efficient manner
  }*/

  $("#show-data").click(function(){
    canvas = prepareCanvas();

    var year = (document).getElementById("select-year").value;
    var month = (document).getElementById("select-month").value;
    var days = (document).getElementById("select-day").value;
    var day = +month + +days;

    //CHANGE-NOTICE modify asyncGetDataFromTable to include
    // year, month and day(or equivalent data)
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
