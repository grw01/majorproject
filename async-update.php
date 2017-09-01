<?php
  require_once "php/functions/database.php";
  require_once "php/functions/general.php";
  //can't use requirements.php or the html will be included in the 'echo'

//TO RETURN DATA FROM ASYNC PHP USE ECHO NOT RETURN

  if(isset($_POST["action"])){
    if($_POST["action"]=="get_data_async"){
      $result = retrieveTable($_POST["tableName"]);
      if(($result==null) || ($result == "")){
        logToFile("Data not found");
      }else{
      //  var_dump($result);
        $arrayJSONData = json_encode(dataToArray($result));
        echo($arrayJSONData);
      }
    }
  }

  function dataToArray($row){
	  $array = array();
	  foreach($row as $value){
        array_push($array, $value);
    }
	  return $array;
  }
?>
