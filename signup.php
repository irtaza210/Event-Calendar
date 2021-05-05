<?php
include_once('database.php');
header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if(isset($json_obj['username']) && isset($json_obj['password'])){
  $username = (string)htmlentities($json_obj['username']);
  $password = (string)htmlentities($json_obj['password']);
  $hashedpassword = password_hash($password, PASSWORD_BCRYPT);
  // first checks if the user that was input already exists
  $stmt1 = $mysqli->prepare("select username from users where username='$username'");
    if(!$stmt1){
        echo json_encode(array(
            "success" => false,
            "message" => "failure"
        ));
        exit;
    }
    $stmt1->execute();
    $stmt1->bind_result($temp_user);
    $stmt1->fetch();
    $stmt1->close();
    // if it does, returns error message
    if($username==$temp_user){
      echo json_encode(array(
        "success" => false,
        "message" => "User already exists"
      ));
      exit;
      // otherwise inserts username and hashed password into database
    }else{
      $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
      if(!$stmt)
      {
        echo json_encode(array(
          "success" => false,
          "message" => "Incorrect Username or Password"
        ));
        exit;
      }

      $stmt->bind_param('ss', $username, $hashedpassword);

      $stmt->execute();
      echo json_encode(array(
        "success" => true,
        "message" => "User Registered",
      ));
      exit;
      $stmt->close();
    }
    
}
?>