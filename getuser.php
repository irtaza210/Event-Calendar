<?php
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];
// used to check if user session is set (i.e user is logged in and if so, returns true to checklogin javascript function. if value is true, 
// user stays logged in upon refresh)
$success = isset($_SESSION['username']);
$token = $_SESSION['token'];
echo json_encode(array(
    "username" => $username,
    "success" => $success,
    "token"=>$token
));
?>