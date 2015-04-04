<?php
//initialize the session
if (!isset($_SESSION)) {
    session_start();
}

//to fully log out a visitor we need to clear the session variables
$_SESSION['logged_user']                = null;
$_SESSION['logged_userRole']            = 3;
$_SESSION['logged_userName']            = null;
$_SESSION['logged_userFatherslastname'] = null;
$_SESSION['logged_userMotherslastname'] = null;
$_SESSION['logged_userDatabase']        = null;
unset($_SESSION['logged_user']);
unset($_SESSION['logged_userName']);
unset($_SESSION['logged_userFatherslastname']);
unset($_SESSION['logged_userMotherslastname']);
unset($_SESSION['logged_userDatabase']);

echo '{"success":true}';

?>