<?php
$servername = "localhost";
$username = "uniquega_course";
$password = "46461Asasd!@";
$dbname = "uniquega_game";
// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_GET["action"]=="read")
{
    $sql = "SELECT * FROM scores ORDER by sum DESC LIMIT 20";
    $result = $conn->query($sql);
    $rows = array();
    while($row = $result->fetch_assoc()) {
       array_push($rows, $row);
    }
    echo json_encode($rows);
    $conn->close();
} else if($_GET["action"]==='insert'){
    $nickName = $_GET["nickName"];
    $mistake = $_GET["mistake"];
    $score = $_GET["score"];
    $help = $_GET["help"];
    $sum = ($score * 7) -($mistake * 1) -($help * 3);
    $sql = "INSERT INTO scores (nickName,score,mistake,help,sum) VALUES ('".$nickName."', ".$score.",".$mistake.",".$help." , ".$sum.")";
    if ($conn->query($sql) === TRUE) {
        $result=  array();
        $result["status"]="ok";
        echo json_encode($result);
    } else {
        $result=  array();
        $result["status"]="fail";
        echo json_encode($result);
    }
}
?>