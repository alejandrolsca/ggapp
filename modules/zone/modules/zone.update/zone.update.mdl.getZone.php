<?php include "../../../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select
                        zo_jsonb
                    from  public.zone
                    where zo_id = '".$_POST['zo_id']."';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    foreach($result as $row) {
        echo $row['zo_jsonb'];
    }
$pgsql->disconnect();
?>