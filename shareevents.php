<?php
require 'database.php';
header("Content-Type: application/json");
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
$user_id = htmlentities($json_obj['name']);
$eventid = htmlentities($json_obj['shareid']);
$sessionuser = $_SESSION['username'];
// if the user inputs their own username when asked what user they want to 
// share the group event with, this statement doesnt go through. this is to avoid user sharing event with themselves
if($user_id!=$_SESSION['username']){
    // then we check if user that was input by logged in user even exists
    $user_exists = $mysqli->prepare("select username from users where username='$user_id'");
    // if they dont error message is thrown
    if(!$user_exists){
        echo json_encode(array(
            "success" => false,
            "message" => "nouserexists"
        ));
        exit;
    }
    $user_exists->execute();
    $user_exists->bind_result($temp_user);
    $user_exists->fetch();
    $user_exists->close();
    // if user exists, then all the details of the event are pulled from logged in user's table
    if($temp_user==$user_id){
        $stmt = $mysqli->prepare("SELECT name, date, time FROM events where id = '$eventid' and username ='$sessionuser'");
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "failure"
            ));
            exit;
        }
        $stmt->execute();
        $stmt->bind_result($eventtitle, $eventdate, $eventtime);
        $stmt->fetch();
        if(!isset($_SESSION['token'])){
            die("Request forgery detected");
        }
        $stmt->close();
        // and inserted into the table of the user that was inputted by the logged in user
        $new_event = $mysqli->prepare("insert into events (name, username, date, time) values (?,?,?,?) ");
        if(!$new_event){
            echo json_encode(array(
                "success" => false,
                "message" => "failure"
            ));
            exit;
        }
        $new_event->bind_param('ssss', $eventtitle, $user_id, $eventdate, $eventtime);

            echo json_encode(array(
                "success" => true,
                "message" => "success"
        ));
        $new_event->execute();
        $new_event->close();
            exit;
    }
}
else{
    echo json_encode(array(
    "success" => false,
    "message" => "failure"
    ));
    exit;
}
?>
