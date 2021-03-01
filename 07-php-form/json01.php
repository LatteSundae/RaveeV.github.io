<?php
$string = file_get_contents("provinces.json");
$json_a = json_decode($string,true);

foreach ($json_a as $key => $value){
//   echo  $key . ':' . $value;
  echo  $key . ':' . $value['PROVINCE_NAME'];
}
?>