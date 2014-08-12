<?php 
    if (!isset($_SESSION)) {
        session_start();
    }
    
    if(isset($_SESSION['logged_user'])&&
         isset($_SESSION['logged_userRole'])&&
         isset($_SESSION['logged_userName'])&&
         isset($_SESSION['logged_userFatherslastname'])&&
         isset($_SESSION['logged_userMotherslastname'])&&
         isset($_SESSION['logged_userDatabase'])) 
    {
        
        $user                   = $_SESSION['logged_user'];
        $userRole               = $_SESSION['logged_userRole'];
        $userName               = $_SESSION['logged_userName'];
        $userFatherslastname    = $_SESSION['logged_userFatherslastname'];
        $userMotherslastname    = $_SESSION['logged_userMotherslastname'];
        $userDatabase           = $_SESSION['logged_userDatabase'];
    
        echo '{
        "success":true,
        "user":"'.$user.'",
        "userRole":'.$userRole.',
        "userName":"'.$userName.'",
        "userFatherslastname":"'.$userFatherslastname.'",
        "userMotherslastname":"'.$userMotherslastname.'",
        "userDatabase":"'.$userDatabase.'"
        }';
    } else {
        echo '{
        "success":true,
        "user":null,
        "userRole":3,
        "userName":null,
        "userFatherslastname":null,
        "userMotherslastname":null,
        "userDatabase":null
        }';
    }        
?>