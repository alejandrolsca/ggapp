<?php include "../../inc/settings.php"; ?>
<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$pgsql = new PDODB(DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, $_SESSION['logged_userDatabase']);
$pgsql->beginTransaction();
$result = $pgsql
        ->prepare("select 
                        *
                    from  public.supplier, 
                    jsonb_to_record(su_jsonb, true) as x (
                        su_corporatename text,
                        su_tin text,
                        su_name text,
                        su_fatherslastname text,
                        su_motherslastname text,
                        su_street text,
                        su_streetnumber text,
                        su_suitenumber text,
                        su_neighborhood text,
                        su_addressreference text,
                        su_country text,
                        su_state text,
                        su_city text,
                        su_county text,
                        su_zipcode text,
                        su_email text,
                        su_phone text,
                        su_mobile text,
                        su_status text
                    );")
        ->execute()
        ->fetchAll();
$pgsql->commit();
    echo json_encode($result);
$pgsql->disconnect();
?>