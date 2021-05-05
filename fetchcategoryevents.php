<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
$token = htmlentities($json_obj['token']);
// we will first check if the user can even access this page. if the user is not logged in or if the user is logged in but the session token does not agree 
// in value with the posted token,they cant see the contents of this file or make any modifications at all
if(!isset($_SESSION['username'])){ 
    die("You are accessing a page you do not have acccess to");
} 
else if(!hash_equals($_SESSION['token'], $token)){ 
    die("You are accessing a page you do not have acccess to");
} 
// gets all the events according to a category and stores the event into an array called data. this array has all the specifics of
// the event such as event name, date, time, category. all these specifics are displayed on the page using a table
$user_id = $_SESSION['username'];
$category = $json_obj['category'];
$database = mysqli_connect("localhost", "root", "y0kId432", "module5");
$stmt= mysqli_query($database, "SELECT * FROM events where username = '$user_id' and category = '$category' order by date,time");
$data = array();
while ($row = mysqli_fetch_object($stmt))
{
    array_push(($data), $row);
}
echo json_encode($data);
exit();