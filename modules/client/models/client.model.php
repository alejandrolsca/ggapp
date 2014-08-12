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
                    from  public.client, 
                    jsonb_to_record(cl_jsonb, true) as x (
                        cl_corporatename text,
                        cl_tin text,
                        cl_name text,
                        cl_fatherslastname text,
                        cl_motherslastname text,
                        cl_street text,
                        cl_streetnumber text,
                        cl_suitenumber text,
                        cl_neighborhood text,
                        cl_addressreference text,
                        cl_country text,
                        cl_state text,
                        cl_city text,
                        cl_county text,
                        cl_zipcode int,
                        cl_email text,
                        cl_phonenumber text,
                        cl_mobilenumber text,
                        cl_creditlimit decimal,
                        cl_customerdiscount decimal,
                        cl_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>