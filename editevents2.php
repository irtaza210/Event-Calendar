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
// edits the event according to the event id and the logged in user
$editid = htmlentities($json_obj['editid']);
$edittitle = htmlentities($json_obj['edittitle']);
$editdate = htmlentities($json_obj['editdate']); 
$edittime = htmlentities($json_obj['edittime']);
$editcategory = htmlentities($json_obj['editcategory']);
$stmt = $mysqli->prepare("update events set name=?, date=?, time=?, category=? where id=? and username=?");
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Query Failed"
            ));
            exit;
        }
        $user_id = $_SESSION['username'];
        $stmt->bind_param('ssssss', $edittitle, $editdate, $edittime, $editcategory, $editid, $user_id);
        
            echo json_encode(array(
                "success" => true,
                "message" => "Add Success"
          ));
          $stmt->execute();
          $stmt->close();
            exit;
?>