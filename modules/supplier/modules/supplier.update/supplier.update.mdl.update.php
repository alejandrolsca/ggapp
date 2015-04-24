<?php include "../../../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("update public.supplier
                    set su_jsonb = '".json_encode($_POST['su_jsonb'])."'
                    where su_id = '".$_POST['su_id']."';")
        ->execute()
        ->rowCount();
$pgsql->commit();
    echo $result;
$pgsql->disconnect();
?>