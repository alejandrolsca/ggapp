<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.paper, 
                    jsonb_to_record(pa_jsonb, true) as x (
                        su_id text,
                        pa_code text,
                        pa_type text,
                        pa_description text,
                        pa_weight text,
                        pa_width text,
                        pa_height text,
                        pa_price text,
                        pa_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>