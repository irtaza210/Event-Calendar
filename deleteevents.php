<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json"); 
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
// deletes the event according to the event id and the logged in user
$eventid = htmlentities($json_obj['deleteid']);
$stmt = $mysqli->prepare("DELETE FROM events WHERE id = ? and username=?");
$stmt->bind_param('ss', $eventid, $_SESSION['username']);
$stmt->execute();
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => "delete failed"
	));
	exit;
	
}
else{	
	echo json_encode(array(
		"success" => true
	));
	exit;
	}
$stmt->close();
?>