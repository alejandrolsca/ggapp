<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.ink, 
                    jsonb_to_record(in_jsonb, true) as x (
                        su_id text,
                        in_code text,
                        in_type text,
                        in_description text,
                        in_weight text,
                        in_width text,
                        in_height text,
                        in_price text,
                        in_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>