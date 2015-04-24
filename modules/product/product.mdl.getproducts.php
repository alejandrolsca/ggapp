<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.product, 
                    jsonb_to_record(pr_jsonb, true) as x (
                        cl_id text,
                        pr_product text,
                        pr_corporatename text,
                        pr_tin text,
                        pr_immex text,
                        pr_name text,
                        pr_fatherslastname text,
                        pr_motherslastname text,
                        pr_street text,
                        pr_streetnumber text,
                        pr_suitenumber text,
                        pr_neighborhood text,
                        pr_addressreference text,
                        pr_country text,
                        pr_state text,
                        pr_city text,
                        pr_county text,
                        pr_zipcode text,
                        pr_email text,
                        pr_phone text,
                        pr_mobile text,
                        pr_status text
                    )
                    where pr_jsonb->>'cl_id' = '".$_POST['cl_id']."';")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>