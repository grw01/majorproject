$(document).ready(function(){
  canvas = prepareCanvas();
  if((localStorage.getItem("magnetometer") == "") || (localStorage.getItem("magnetometer") == null)){
    console.log("magnetometer is null");
    asyncGetDataFromTable("magnetometer");
    //CHANGE-NOTICE need to add other sources of data later
  }else{
    console.log("local magnetometer data is not null");
    //CHANGE-NOTICE will need to be modified to add the other sources in an efficient manner
  }

  $("#show-data").click(function(){
    canvas = prepareCanvas();
    //asyncGetDataFromTable("magnetometer");
    calculateTimeIntervalAndDraw(canvas);
  });

  $("#select-year").change(function(){
    showCorrectDates();
  });
  $("#select-month").change(function(){
    showCorrectDates();
  });

});
