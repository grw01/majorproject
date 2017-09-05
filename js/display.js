

//---------Start of code block from:
//http://stackoverflow.com/questions/15661339/how-do-i-fix-blurry-text-in-my-html5-canvas
//Username: MyNameIsKo
//creates a higher resolution canvas, otherwise text on the canvas was extremely blurry
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}
//-------------------------End of code block from stackoverflow

function prepareCanvas(){
  var canvasDiv = (document).getElementById("canvasDiv");
  var myCanvas = (document).getElementById("dataCanvas");
  if(myCanvas==null){
    myCanvas = createHiDPICanvas(600, 360, 1);
    myCanvas.setAttribute("id", "dataCanvas");
    canvasDiv.insertBefore(myCanvas, myCanvas.childNodes[0]);
  }else{
    myCanvas = (document).getElementById("dataCanvas");
  }
  var myCanvasContext = myCanvas.getContext("2d");
  drawGraph(myCanvas, myCanvasContext);
  return myCanvas;


}

//some of the offsets are arbitary and were derived from trial and error
// due to the code that ensures that the canvas pixel ratio is correct
function drawGraph(canvas, context){
  context.font="15px calibri bold";
  context.lineWidth = 1;
  var graphHeight = canvas.height-41;
  var graphWidth = canvas.width-30;
  //draws the background
  context.fillStyle = "#ffffff";
  context.fillRect(25,20, graphWidth, graphHeight);
  context.fillStyle = "#dcdcdc";
  context.fillRect(0,0, 25, canvas.height);
  context.fillRect(24, (graphHeight+20), canvas.width, 41);
  context.fillStyle = "#000000";

  //draws the horizontal lines and labels
  for(i = 0; i<15; i++){
    drawY = (graphHeight+35)*(i/16)+30;
    numLabel = (56-i*2.5);
    context.fillText(numLabel, 0, drawY);
    drawLine(context, 25, drawY, graphWidth+25, drawY);
  }
  //draws the vertical lines and labels
  for(i = 0; i<25; i++){
    drawX = (graphWidth+23)*(i/25)+15;
    context.fillText(i, drawX, graphHeight+41);
    drawLine(context, drawX+10, 20, drawX+10, graphHeight+20);
  }
}

function drawLine(context, x1, y1, x2, y2){
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

//CHANGE-NOTICE need to account for Daylight Saving
function calculateTimeIntervalAndDraw(canvas, year, day){
  var context = canvas.getContext("2d");

  lsString = localStorage.getItem("magnetometer");
  if(lsString == ""){
    console.log("(Function calculate) no local data found");
    alert("no data for chosen date");
    return;
  }
  //console.log("lsString: " + lsString + " end of lsString");
  parsedString = JSON.parse(lsString);

  //console.log("year: " + year + " day: " + day);
  var chosenDataArray = getChosenDateData(parsedString, year, day);
  var secondsInYear = 31536000;//365 days: 31536000  //365.25 days: 31557600
  var secondsInDay = 86400;
  var leapDays = 28;
  var daylightSaving = 0; //will be used to subtract 3600 seconds if in daylight saving time
  if(year<2017){leapDays = 28}else{leapDays = 29}//accounts for the leap-years since 1904, trial and error indicates that leap days are added completely for each year, instead of defining year as 365.25 days

  /*decided that if statement would be better than case statement since there are multiple conditions but only 1
  answer,(changing daylightSaving to 3600 instead of 0) so it will take up less space,
  added extra statement to show/hide "Daylight Saving" label since it needs to display a day longer than the
  variable needs to be 3600*/

  if((year==2014 && day>87 && day<298)||
  (year==2015 && day>86 && day<298)||
  (year==2016 && day>86 && day<304)||
  (year==2017 && day>83 && day<302)){
    daylightSaving=3600;
  }
  if((year==2014 && day>87 && day<299)||
  (year==2015 && day>86 && day<299)||
  (year==2016 && day>86 && day<305)||
  (year==2017 && day>83 && day<303)){
    $('#daylight_saving').show();
  }else {
    $('#daylight_saving').hide();
  }

  var secondsPassedByChosenDay = ((year-1904)*secondsInYear)+(((day+leapDays)*secondsInDay)-daylightSaving);
  var intensityMax = 35000; //chosen by checking the DB for the highest value(55961),
                            //Then subtracting 21000, since only 1 value goes undeneath it,
                            //and is most likely an outlier/mistake(1056)
  //console.log("secondsPassedByChosenDay: " + secondsPassedByChosenDay);

  if (chosenDataArray.length>0){
    var graphHeight = canvas.height-41;
    var graphWidth = canvas.width-30;
    context.lineWidth=1.5;
    context.beginPath();

    for (var i = 0; i < chosenDataArray.length; i++){
      var seconds = (chosenDataArray[i]["time"])-(secondsPassedByChosenDay); //extra offset of half a day required for correct display
      var secondsPercent = seconds/secondsInDay;
      var intensity = chosenDataArray[i]["intensity"];
      var intensityPercent = (intensity-20000)/intensityMax;

      if(i==0){
        console.log("FIRST VALUE FOR DAY---- secondsPassed: " + secondsPassedByChosenDay + " secondsInDay: " + seconds + " secondsPercent: " + secondsPercent + " intensity: " + intensity + " intensityPercent: " + intensityPercent);
        context.moveTo(graphWidth*secondsPercent+25, ((graphHeight+41)-(graphHeight*intensityPercent)));
      }else{
        context.lineTo(graphWidth*secondsPercent+25, ((graphHeight+41)-(graphHeight*intensityPercent)));
      }
      if(i+1==chosenDataArray.length){
        console.log("LAST VALUE FOR DAY---- secondsInDay: " + seconds + " secondsPercent: " + secondsPercent + " intensity: " + intensity + " intensityPercent: " + intensityPercent);
      }
    }
    context.stroke();
  }
}

function getChosenDateData(objArray, year, day){
  var relevantDataArray = [];
  var j = 0;
  for (var i = 0; i < objArray.length; i++) {
    var object = objArray[i];
    if((object['year'] == year) && (object['day'] == (day+1))){//day+1 because drop-down starts on 0, the DB on 1
      relevantDataArray[j]=object;
      j++;
      //console.log('object ' + i + ', time: ' + object["time"]);
    }

  }
  return relevantDataArray;
}

//Disables or enables the available days depending on the month and if it's a leap year or not
function showCorrectDates(){
  year = $("#select-year").find("option:selected").attr("class");
  month = $("#select-month").find("option:selected").attr("class");
  $('#select-day option').prop('disabled', false);
  switch (month){
    case "feb":
      $('#select-day option').prop('disabled', false);
      if(year == "leap-year"){
        $('#select-day option:eq(29)').prop('disabled', true);
        $('#select-day option:eq(30)').prop('disabled', true);
      }else{
        $('#select-day option:eq(28)').prop('disabled', true);
        $('#select-day option:eq(29)').prop('disabled', true);
        $('#select-day option:eq(30)').prop('disabled', true);
      }
      break;
    case "30day":
      $('#select-day option').prop('disabled', false);
      $('#select-day option:eq(30)').prop('disabled', true);
      break;
    case "31day":
      $('#select-day option').prop('disabled', false);
  }
    $("#select-day").val("0");
}
