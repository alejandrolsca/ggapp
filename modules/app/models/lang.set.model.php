<?php 
    if (!isset($_SESSION)) {
        session_start();
    }
    $_POST = json_decode(file_get_contents('php://input'), true);
    $_SESSION['language'] = $_POST['lang'];
    echo '{"success":true,"lang":"'.$_SESSION['language'].'"}';
?>