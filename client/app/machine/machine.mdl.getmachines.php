<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.machine, 
                    jsonb_to_record(ma_jsonb, true) as x (
                        ma_name text,
                        ma_maxsizewidth text,
                        ma_maxsizeheight text,
                        ma_minsizewidth text,
                        ma_minsizeheight text,
                        ma_sizemeasure text,
                        ma_totalinks text,
                        ma_fullcolor text,
                        ma_printbg text,
                        ma_process text,
                        ma_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>