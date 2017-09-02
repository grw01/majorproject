<?php
function logToFile($txt){

  $myfile = fopen("logfile.txt", "a") or die("Unable to open file!");
  date_default_timezone_set('Europe/London');
  $date = date('m/d/Y h:i:s a');
  $txt = "[" . $date . "]: " . $txt . "\n";
  fwrite($myfile, $txt);
  fclose($myfile);
}


function retrieveTable($selectedTable, $year, $day){
    $table;
    switch($selectedTable){
      case 'magnetometer':
        $columnTitles = array("Year" => "year","Day" => "day","Time" => "time","Intensity" => "intensity");
        $table = retrieveTableInfo($columnTitles, $selectedTable, $year, $day, "time");
        break;
        //CHANGE-NOTICE need to add case statements for the other data sources' tables
      default:
      //defaults to the farm magnetometer
        $columnTitles = array("Year" => "year","Day" => "day","Time" => "time","Intensity" => "intensity");
        $table = retrieveTableInfo($columnTitles, $selectedTable, $year, $day, "time");
    }
    return $table;

}

  function retrieveTableInfo($columnTitles, $tableName, $year, $day, $sortKey){
    if(!isset($sortKey)){
      $sortKey = "id";
    }
    $columnString = implode( ", ", $columnTitles);
    logToFile("column string: ".$columnString);
    $query = "SELECT $columnString FROM `$tableName` WHERE year=$year AND day=$day ORDER BY $sortKey";
    logToFile("retrieve table info query: ".$query);
    $tableInfo = selectDB($query);
    return $tableInfo;
  }



?>
