<?php 
    if (!isset($_SESSION)) {
      session_start();
    }
    header("Content-Type: application/json");
	define("LOG_DIR","./log");
	define("LOG_FILE","log.txt");
	define("DB_TYPE","pgsql");
	define("DB_HOST","localhost");
	define("DB_PORT","5432");
    define("DB_USER","Alejandro");
	define("DB_PASS","a186419.ASB");
	include "../../../inc/log.class.php";
	include "../../../inc/pdodb.class.php";
?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_POST["us_database"]);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select * from public.user where us_user = :us_user and us_password = :us_password;")
        ->bindValue(":us_user",$_POST["us_user"])
        ->bindValue(":us_password",$_POST["us_password"])
        ->execute()
        ->fetch();
$pgsql->commit();
if ($pgsql->rowCount()==1) {
    $user          = $result['us_user'];
    $userGroup     = $result['gr_id'];
	$userFullName  = $result['us_name'].' '.$result['us_fatherslastname'].' '.$result['us_motherslastname'];
    
	if (PHP_VERSION >= 5.1) {session_regenerate_id(true);} else {session_regenerate_id();}

    $_SESSION['logged_user']           = $user;
    $_SESSION['logged_userGroup']      = $userGroup;
	$_SESSION['logged_userFullName']   = $userFullName;
    $_SESSION['logged_userDatabase']   = $_POST["us_database"];
    
    echo '{"success":true}';
  }
  else {
    echo '{"success":false}';
  }
$pgsql->disconnect();
?>