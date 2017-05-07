$(document).ready(function(){
  canvas = prepareCanvas();
  if(localStorage.getItem("magnetometer") !== null){
    //CHANGE-NOTICE will need to be modified to add the other sources in an efficient manner
  }else{
    asyncGetDataFromTable("magnetometer");
    //CHANGE-NOTICE need to add other sources of data later
  }

  $("#show-data").click(function(){
    canvas = prepareCanvas();
    calculateTimeIntervalAndDraw(canvas);
  });

  $("#select-year").change(function(){
    showCorrectDates();
  });
  $("#select-month").change(function(){
    showCorrectDates();
  });

});
