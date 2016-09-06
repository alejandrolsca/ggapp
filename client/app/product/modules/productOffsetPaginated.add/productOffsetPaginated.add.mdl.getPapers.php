<?php include "../../../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select
                        *
                    from  public.paper, 
                    jsonb_to_record(pa_jsonb, true) as x (
                        pa_code text,
                        pa_width text,
                        pa_height text,
                        pa_measure text
                    )
                    where pa_jsonb->>'pa_status'='A';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>