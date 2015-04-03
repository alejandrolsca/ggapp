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
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.zone, 
                    jsonb_to_record(zo_jsonb, true) as x (
                        cl_id text,
                        zo_zone text,
                        zo_corporatename text,
                        zo_tin text,
                        zo_immex text,
                        zo_name text,
                        zo_fatherslastname text,
                        zo_motherslastname text,
                        zo_street text,
                        zo_streetnumber text,
                        zo_suitenumber text,
                        zo_neighborhood text,
                        zo_addressreference text,
                        zo_country text,
                        zo_state text,
                        zo_city text,
                        zo_county text,
                        zo_zipcode text,
                        zo_email text,
                        zo_phone text,
                        zo_mobile text,
                        zo_status text
                    )
                    where zo_jsonb->>'cl_id' = '".$_POST['cl_id']."';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>