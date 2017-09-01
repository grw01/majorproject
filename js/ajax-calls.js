/*----------------------START OF ajax-calls-------------------*/
//The depreceated syncronous request is used because otherwise
//the following JS executes too quickly and fails to draw
function asyncGetDataFromTable(tableName, year, day){
  var data = {
    'action': 'get_data_async',
    'tableName': tableName,
    'year': year,
    'day': day
  };
  console.log("year " + year + " , day " + day);

  var ajaxCall = $.ajax({
    url: 'async-update.php',
    type: 'post',
    async:false,
    data: data,
    success: function(data){
      //console.log("AJAX success data: " + data + " :end success data");
      localStorage.setItem(tableName, data);
    },
    error: function(xhr, desc, err){
      console.log("AJAX failure");
    }
  });
}

function asyncGetTempData(){
  //should I overwrite with the new(and old) data,(takes longer, simple)
  //check the database and only get then upload new data,(more complicated, no needless data retrieval)
  //or temp download all data and then check and upload new data?(might be easier to check database after getting the data)
}

/*----------------------END OF ajax-calls-------------------*/
