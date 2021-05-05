<?php
ini_set("session.cookie_httponly", 1);
require 'database.php';
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if(isset($json_obj['username']) && isset($json_obj['password'])){
  $user = htmlentities($json_obj['username']);
  $normalpassword = htmlentities($json_obj['password']);
  $stmt = $mysqli->prepare("SELECT COUNT(*), username, password FROM users WHERE username=?");
  $username = $_POST['username'];
  $stmt->bind_param('s', $user);
  $stmt->execute();
  $stmt->bind_result($count, $username2, $hashedpassword);
  $stmt->fetch();
  if($count>0 && password_verify($normalpassword, $hashedpassword)){
    session_start();
    $_SESSION['username'] = $username2;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    echo json_encode(array(
      "success" => true,
      "username" => htmlentities($_SESSION['username']),
      "token" => $_SESSION['token']
    ));
    exit;
  } else {
    echo json_encode(array(
      "success" => false,
      "message" => "Incorrect Username or Password"
    ));
    exit;
  }
}
?>