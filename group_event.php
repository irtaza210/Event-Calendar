<?php
require 'database.php';
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);
// we will first check if the user can even access this page. if the user is not logged in or if the user is logged in but the session token does not agree 
// in value with the posted token,they cant see the contents of this file or make any modifications at all
$token = htmlentities($json_obj['token']);
if(!isset($_SESSION['username'])){ 
    die("You are accessing a page you do not have acccess to");
} 
else if(!hash_equals($_SESSION['token'], $token)){ 
    die("You are accessing a page you do not have acccess to");
} 
$eventtitle = htmlentities($json_obj['eventtitle']);
$eventdate = htmlentities($json_obj['eventdate']); 
$eventtime = htmlentities($json_obj['eventtime']);
$user_id = htmlentities($json_obj['user']);
$eventcategory = htmlentities($json_obj['eventcategory']);
if(!isset($_SESSION['token'])){
    die("Request forgery detected");
}
// if the user inputs their own username when asked what additional group members they want to 
// have the group event with, this statement doesnt go through. this is to avoid duplicate group events for the logged in user
if($user_id!=$_SESSION['username']){
    // this statement is used to check if the username inputted by the user as the additionl group member even exists
    $user_exists = $mysqli->prepare("select username from users where username='$user_id'");
    // if user doesnt exist, error message is shown in javascript function telling them user doesnt exist 
    if(!$user_exists){
        echo json_encode(array(
            "success" => false,
            "message" => "failure"
        ));
        exit;
    }
    $user_exists->execute();
    $user_exists->bind_result($temp_user);
    $user_exists->fetch();
    $user_exists->close();
    // if user exists, group event is added for the user that was input by the logged in user. 
    if($temp_user==$user_id){
    $new_event = $mysqli->prepare("insert into events (name, username, date, time, category) values (?,?,?,?,?)");
            if(!$new_event){
                echo json_encode(array(
                    "success" => false,
                    "message" => "Query Failure"
                ));
                exit;
            }
            $new_event->bind_param('sssss', $eventtitle, $user_id, $eventdate, $eventtime, $eventcategory);
    
                echo json_encode(array(
                    "success" => true,
                    "message" => "success"
            ));
            $new_event->execute();
            $new_event->close();
                exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "User does not exist"
        ));
        exit;
    }
}
?>