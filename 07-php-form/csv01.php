<?php
// Get a file handle
$file = fopen("provinces.csv", "r");
$counter = 0;
$provinces = array();
while (!feof($file)) {
    $line = fgetcsv($file);
    $counter++;

    if ($counter == 1) continue;

    // echo print_r($line).'<br/>';
    array_push($provinces, $line);
}


// define sorting method
function cmp($a, $b) {
    return strcmp($a[2], $b[2]);
}

usort($provinces, "cmp");

echo '<pre>';
echo var_dump($provinces);
echo '</pre>';

fclose($file);
?>