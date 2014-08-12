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
        ->prepare("select us_jsonb->>'us_user' as us_user,
        us_jsonb->>'gr_id' as gr_id,
        us_jsonb->>'us_name' as us_name,
        us_jsonb->>'us_fatherslastname' as us_fatherslastname,
        us_jsonb->>'us_motherslastname' as us_motherslastname
        from public.user 
        where us_jsonb->>'us_user' = :us_user and us_jsonb->>'us_password' = :us_password;")
        ->bindValue(":us_user",$_POST["us_user"])
        ->bindValue(":us_password",$_POST["us_password"])
        ->execute()
        ->fetch();
$pgsql->commit();
if ($pgsql->rowCount()==1) {
    $user                   = $result['us_user'];
    $userRole               = $result['gr_id'];
	$userName               = $result['us_name'];
    $userFatherslastname    = $result['us_fatherslastname'];
    $userMotherslastname    = $result['us_motherslastname'];
    $userDatabase           = $_POST["us_database"];
    
	if (PHP_VERSION >= 5.1) {session_regenerate_id(true);} else {session_regenerate_id();}

    $_SESSION['logged_user']                = $user;
    $_SESSION['logged_userRole']            = $userRole;
	$_SESSION['logged_userName']            = $userName;
    $_SESSION['logged_userFatherslastname'] = $userFatherslastname;
    $_SESSION['logged_userMotherslastname'] = $userMotherslastname;
    $_SESSION['logged_userDatabase']        = $userDatabase; 
    
    echo '{
    "success":true,
    "user":"'.$user.'",
    "userRole":'.$userRole.',
    "userName":"'.$userName.'",
    "userFatherslastname":"'.$userFatherslastname.'",
    "userMotherslastname":"'.$userMotherslastname.'",
    "userDatabase":"'.$userDatabase.'"
    }';
  }
  else {
    echo '{"success":false}';
  }
$pgsql->disconnect();
?>