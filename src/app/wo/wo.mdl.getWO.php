<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  wo, 
                    jsonb_to_record(wo_jsonb, true) as x (
                        cl_id int,
                        zo_id int, 
                        wo_orderedby text,
                        wo_attention text,
                        rfq_id int, 
                        wo_process int,
                        wo_release text,
                        wo_po text,
                        wo_line int,
                        wo_linetotal int,
                        prse_id int, 
                        wo_status text, 
                        wo_commitmentdate timestamp,
                        wo_previousid int,
                        wo_previousdate timestamp,
                        sh_id int,
                        sh_date timestamp, 
                        wo_trackingno text,
                        wo_shippingdate timestamp,
                        wo_deliverydate timestamp,
                        wo_invoiceno text,
                        wo_invoicedate timestamp,
                        wo_notes text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>