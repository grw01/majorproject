<?php
  require_once "php/functions/database.php";
  require_once "php/functions/general.php";
  //cant use requirements.php or the html will be included in the 'echo'

  if(isset($_POST["action"])){
    if($_POST["action"]=="get_data_async"){
      $result = retrieveTable($_POST["tableName"]);
      if($result==null){
        echo "data not found";
      }else{
        $arrayJSONData = json_encode(dataToArray($result));
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
