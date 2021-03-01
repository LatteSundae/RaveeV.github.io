<?php
require_once("config.php");

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

?>
<h1>Employees</h1>
<?php
// Employee
$sql = "SELECT * FROM employees LIMIT 10";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
  // output data of each row
  $counter = 0;
  while($row = mysqli_fetch_assoc($result)) {
    echo "id: " . $row["emp_no"]. " - Name: " . $row["first_name"]. " " . $row["last_name"]. " - ".$row["gender"]."<br>";
    $counter++;
  }
  echo "$counter results";
} else {
  echo "0 results";
}

mysqli_close($conn);

// TODO Show list of departments
?>