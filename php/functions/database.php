<?php

  function databaseConnection($connectType){
    $host;
    if(!isset($connectType)||($connectType == "local")){
      $host="localhost";
      $user="root";
      $password="";
    }else{
      //CHANGE-NOTICE need to change to server address
      $host="localhost";
      $user="root";
      $password="";
    }
    $databaseName = "atmos_data";
  $connection = mysqli_connect($host, $user, $password, $databaseName);

    return $connection;
  }

    function connectToDatabase(){
      static $dataConnect;

      if(!isset($dataConnect)){
        if($_SERVER["SERVER_ADDR"] != "::1"){
          //should connect to server
          $dataConnect = databaseConnection("server");
        }else{
          //should connect to localhost
          $dataConnect = databaseConnection("local");
        }
      }
      if($dataConnect === false){
        return mysqli_error($dataConnect);
      }
      return $dataConnect;
    }

    function queryDB($query){
      //connect to DB
      $connect = connectToDatabase();
      //query DB
    $queryResult = mysqli_query($connect, $query)/* or exit(mysql_error())*/;
      return $queryResult;
    }

    function selectDB($query){
      $selectedRows = array();
      $result = queryDB($query);
      if($result === false){
        //query failed
        return false;
      }

      while($row = mysqli_fetch_assoc($result)){
        $selectedRows[] = $row;
      }
      return $selectedRows;
    }

    function selectRowDB($query){
      if(isset(selectDB($query)[0])){
        return selectDB($query)[0];
      }else{
        return false;
      }
    }

  function checkAndCreateMagnetometerTable(){
    $magnet_list_sql = "CREATE TABLE IF NOT EXISTS `atmos_data`.`magnetometer` (
      `id` INT(11)  NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `year` INT(4) NOT NULL,
      `day` INT(3) NOT NULL,
      `time` BIGINT(12) NOT NULL ,
      `intensity` INT(11) NOT NULL )";

    queryDB($magnet_list_sql);
  }

  //checks the specified DB table for data according to the chosen params,
  //allows the database to be checked for a specific value(so as not to make copies for example)
  //CHANGE-NOTICE returns true, even when database empty
  function checkDataExists($tableName, $selectedField, $selectedFieldValue){
    $query = "SELECT * FROM $tableName WHERE $selectedField = $selectedFieldValue";

    $result = selectDB($query);
    echo("checkdata result: ".$result);
    if(!empty($result)){
      //matching data found
      return true;
    }else{
      //nothing found
      return false;
    }
  }

  function getDataFromTable($tableName, $selectedYear, $selectedDay){
    $query = "SELECT * FROM $tableName WHERE `day` = $selectedDay AND `year` = $selectedYear";
    logToFile("query : ".$query);
    $row = selectRowDB($query);
    if (!empty($row)){
      return $row;
    }else{
      //data not found/error
      return false;
    }
  }

  function getDataFromFTP(){
    $server = "ugexppc15.dph.aber.ac.uk";
    $connection = ftp_connect($server) or die("Could not connect to $server");
    $login = ftp_login($connection, "Magnetometer", "magnetometer");
    ftp_pasv($connection,true);
    //increases timeout limit, initial value of 30s was not enough
    set_time_limit(600);
    $folder_list = ftp_nlist($connection, "/");
    if(!file_exists("tempData")){
      mkdir("tempData");
    }
    foreach($folder_list as $folder_name){
      if(!file_exists("tempData/".$folder_name)){
        mkdir("tempData/".$folder_name);
      }
      $file_list = ftp_nlist($connection, $folder_name);
      unset($file_list[count($file_list)-1]);

      foreach($file_list as $file_name){
        //regular expression matches the format in file 2013 and then 2014 and onwards
        //also ensures that it isn't a copy or a zip file
        $regEx = "/\/DATA[0-9][0-9][0-9](\.csv|\.CSV)|[0-9][0-9][0-9]0000(\.csv|\.CSV)/";

        //at least temporary removal of data from 2013 since the time is stored in 1 int but in hours-minutes-seconds
        //since the start of the day and will require additional manipulation for use.
        if($file_name != "/2013"){
          //removes the extra files, copies and zips
          if(preg_match($regEx,$file_name)){
            $local_file = "tempData".$file_name;
            $server_file = $file_name;
            //echo("filename: ".$file_name." ");
            if(!file_exists($local_file)){
              ftp_get($connection, $local_file, $server_file, FTP_ASCII);
            }
          }
        }
      }
    }
    ftp_pasv($connection,false);
    ftp_close($connection);
  }

  function updateDatabaseTable($tableName, $folderName){
    /*DATA000 format (numbers go from 001 to 366)*/
    $regExFormat1 = "/DATA[0-9][0-9][0-9](\.csv|\.CSV)/";
    /*1230000 format(001 to 366 and 4 extra 0)*/
    $regExFormat2 = "/[0-9][0-9][0-9]0000(\.csv|\.CSV)/";

    $filepath = "./tempData/".$folderName."/";
    $fileArray = scandir($filepath);
    unset($fileArray[0], $fileArray[1]);
    logToFile("last record: ".(end($fileArray)));
    foreach($fileArray as $fileName){
      $day = "";
      if(preg_match($regExFormat1, $fileName)){
        $day = str_ireplace("DATA", "", $fileName);
        $day = str_ireplace(".csv", "", $day);
      }else if(preg_match($regExFormat2, $fileName)){
        $day = substr($fileName, 0, -8);
      }else{
        logToFile("unknown file title format, title: ".$fileName);
        break;
      }
      //if the day is already in the database, break
      if(getDataFromTable("magnetometer", $folderName, $day)){
        logToFile("data for year " . $folderName . ", day " . $day . ", is already in the database");
        break;
      }
      $fullPath = "$filepath$fileName";

      $row = 1;
      $assocArray = array();
      if (($openFile = fopen($fullPath, "r")) !== FALSE) {
        set_time_limit(600);
        while (($data = fgetcsv($openFile)) !== FALSE) {
          if($row % 60 == 0){
            $arrayIndex = ($row/60)-1;
            $assocArray[$arrayIndex] = Array('year' => $folderName,'day' => $day,'time' => $data[0],'intensity' => $data[1]);
          }
          $row++;
        }
        fclose($openFile);
      }
      if(is_array($assocArray)){
        $lastRow = end($assocArray);
        $result = getDataFromTable("magnetometer", $lastRow["year"], (int)$lastRow["day"]);
        //checks if the last entry of the csv is already in the table, if so it will not be uploaded again
        if($result != false){
          logToFile("data already in table: FILE: ". implode($lastRow,", ") . "    Database: " . implode($result,", "));
        }else{
          logToFile("data not in table: ".implode($lastRow,", "));
          $sql_query = "INSERT INTO magnetometer (year, day, time, intensity) values ";

          $valuesArray = array();
          foreach($assocArray as $row){
            $year = (int) $row['year'];
            $day = (int) $row['day'];
            $time = (string) $row['time'];//has to be set as string here or 2147483647 will be stored instead of actual value
            $intensity = (int) $row['intensity'];

            $valuesArray[] = "('$year', '$day', '$time', '$intensity')";
          }
          $sql_query .= implode(',', $valuesArray);
          queryDB($sql_query);
        }

      }
      //LOAD DATA INFILE does not seem to work for some reason, but doesn't return any errors
      //$sql_query = "LOAD DATA INFILE $fullPath INTO TABLE $tableName ('time', 'intensity', @discardTemperature) SET 'year' = $folderName, 'day' = $day";
      /*if(!queryDB($sql_query)){
        logToFile("query not complete");
        logtofile(mysqli_error(databaseConnection("local")));
        break;
      }*/
    }
  }

?>
