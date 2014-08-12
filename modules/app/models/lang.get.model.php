<?php 
    if (!isset($_SESSION)) {
        session_start();
    }
    echo '{"success":true,"lang":"'.$_SESSION['language'].'"}';
?>