<?php
function logToFile($txt){

  $myfile = fopen("logfile.txt", "a") or die("Unable to open file!");
  date_default_timezone_set('Europe/London');
  $date = date('m/d/Y h:i:s a', time());
  $txt = "[" . $date . "]: " . $txt . "\n";
  fwrite($myfile, $txt);
  fclose($myfile);
}


function retrieveTable($selectedTable){
    $table;
    switch($selectedTable){
      case 'magnetometer':
        $columnTitles = array("Year" => "year","Day" => "day","Time" => "time","Intensity" => "intensity");
        $table = retrieveTableInfo($columnTitles, $selectedTable, "time");
        break;
        //CHANGE-NOTICE need to add case statements for the other data sources' tables
      default:
      //defaults to the farm magnetometer
        $columnTitles = array("Year" => "year","Day" => "day","Time" => "time","Intensity" => "intensity");
        $table = retrieveTableInfo($columnTitles, $selectedTable, "time");
    }
    return $table;

}

  function retrieveTableInfo($columnTitles, $tableName, $sortKey){
    if(!isset($sortKey)){
      $sortKey = "id";
    }
    $columnString = implode( ', ', $columnTitles);
    $query = "SELECT $columnString FROM $tableName ORDER BY $sortKey";
    $tableInfo = selectDB($query);
    return $tableInfo;
  }



?>
