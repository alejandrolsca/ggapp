<?php include "../../../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select
                        *
                    from  public.material, 
                    jsonb_to_record(mt_jsonb, true) as x (
                        mt_code text,
                        mt_width text,
                        mt_height text,
                        mt_measure text
                    )
                    where mt_jsonb->>'mt_status'='A';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>