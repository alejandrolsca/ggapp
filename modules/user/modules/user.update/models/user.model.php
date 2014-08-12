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
	include "../../../../../inc/log.class.php";
	include "../../../../../inc/pdodb.class.php";
?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select
                        us_jsonb
                    from  public.user
                    where us_id = '".$_POST['us_id']."';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    foreach($result as $row) {
        echo $row['us_jsonb'];
    }
$pgsql->disconnect();
?>