

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
  context.fillStyle = "#ffffff";
  context.fillRect(25,20, graphWidth, graphHeight);
  context.fillStyle = "#000000";
  for(i = 0; i<11; i++){
    drawY = (graphHeight+20)*(i/11)+30;
    numLabel = (10-i)*10;
    context.fillText(numLabel, 0, drawY);
    drawLine(context, 25, drawY, graphWidth+25, drawY);
  }
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

function calculateTimeIntervalAndDraw(canvas){
  var context = canvas.getContext("2d");
  lsString = localStorage.getItem("magnetometer");
  if(lsString == ""){
    console.log("(Function calculate) no local data found");
    return;
  }
  //console.log("lsString: " + lsString + " end of lsString");
  parsedString = JSON.parse(lsString);

  var year = (document).getElementById("select-year").value;
  var month = (document).getElementById("select-month").value;
  var days = (document).getElementById("select-day").value;
  var day = +month + +days;
  //console.log("month value: " + month + ", days value: " + days +  ", day(added): "+day);

  //console.log("parsedString:" + parsedString + " year: " + year + " day: " + day);
  var chosenDataArray = getChosenDateData(parsedString, year, (day+1));
  var secondsInYear = 31557600;//365.25 days
  var secondsInDay = 86400;
  var secondsPassedByChosenDay = ((year-1904)*secondsInYear)+((day+1)*secondsInDay);
  var intensityMax = 56000;
  //console.log("secondsPassedByChosenDay: " + secondsPassedByChosenDay);
  //console.log("chosenDataArray: " + chosenDataArray);

  if (chosenDataArray.length>0){
    var graphHeight = canvas.height-41;
    var graphWidth = canvas.width-30;
    context.lineWidth=1.5;
    context.beginPath();

    for (var i = 0; i < chosenDataArray.length; i++){
      var seconds = (chosenDataArray[i]["time"])-secondsPassedByChosenDay;
      var secondsPercent = seconds/secondsInDay;
      var intensity = (chosenDataArray[i]["intensity"])/intensityMax;
      //console.log("seconds: " + seconds + " secondsPercent: " + secondsPercent + " intensity: " + intensity);
      if(i==0){
        context.moveTo(graphWidth*secondsPercent+25, graphHeight-graphHeight*(intensity)+20);
      }else{
        context.lineTo(graphWidth*secondsPercent+25, graphHeight-graphHeight*(intensity)+20);
      }
      //console.log("x: " + (graphWidth*secondsPercent+25) + " y: " + (graphHeight-graphHeight*(intensity/100)+20));
    }
    context.stroke();
  }else{
    alert("no data for chosen date");
  }

}

function getChosenDateData(objArray, year, day){
  var relevantDataArray = [];
  var j = 0;
  for (var i = 0; i < objArray.length; i++) {
    var object = objArray[i];
    if((object['year'] == year) && (object['day'] == day)){
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
