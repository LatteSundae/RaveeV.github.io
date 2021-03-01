<?php

// $servername = "localhost";
// $username = "root";
// $password = "admin";
// $dbname = "employees";


// HARD CODING
// mysql://b4c7ffe5a5a37c:218c61d0@us-cdbr-east-02.cleardb.com/heroku_07c44eac08d0ae1?reconnect=true
// $servername = "us-cdbr-east-02.cleardb.com";
// $username = "b4c7ffe5a5a37c";
// $password = "218c61d0";
// $dbname = "heroku_960ef3a2688ca52";



$url = parse_url(getenv("mysql://be4d7c09e434ba:70b5b93e@us-cdbr-east-03.cleardb.com/heroku_960ef3a2688ca52?reconnect=true"));
$servername = $url["us-cdbr-east-03.cleardb.com"];
$username = $url["be4d7c09e434ba"];
$password = $url["70b5b93e"];
$dbname = substr($url["heroku_960ef3a2688ca52"], 1);



echo "Extracted Info $servername $username $password $dbnane<br>";<?php

