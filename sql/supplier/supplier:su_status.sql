select 
    *
from  public.supplier, 
jsonb_to_record(su_jsonb) as x (
    su_type text,
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
)
where su_jsonb->>'su_status' = $1;