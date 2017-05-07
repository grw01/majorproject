/*----------------------START OF ajax-calls-------------------*/

function asyncGetDataFromTable(tableName){
  var data = {
    'action': 'get_data_async',
    'tableName': tableName
  };

  var ajaxCall = $.ajax({
    url: 'async-update.php',
    type: 'post',
    data: data,
    success: function(data, status){
      console.log("AJAX success data: " + data + " :end success data");
      localStorage.setItem(tableName, data);
    },
    error: function(xhr, desc, err){

    }
  });
}

function asyncGetTempData(){
  //should I overwrite with the new(and old) data,(takes longer, simple)
  //check the database and only get then upload new data,(more complicated, no needless data retrieval)
  //or temp download all data and then check and upload new data?(might be easier to check database after getting the data)
}

/*----------------------END OF ajax-calls-------------------*/
