<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.user, 
                    jsonb_to_record(us_jsonb, true) as x (
                        gr_id int,
                        us_user text,
                        us_password text,
                        us_name text,
                        us_fatherslastname text,
                        us_motherslastname text,
                        us_email text,
                        us_phone text, 
                        us_mobile text,
                        us_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>