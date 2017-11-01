select 
    *
from  public.client, 
jsonb_to_record(cl_jsonb) as x (
    cl_type text,
    cl_corporatename text,
    cl_tin text,
    cl_name text,
    cl_firstsurname text,
    cl_secondsurname text,
    cl_street text,
    cl_streetnumber text,
    cl_suitenumber text,
    cl_neighborhood text,
    cl_addressreference text,
    cl_country text,
    cl_state text,
    cl_city text,
    cl_county text,
    cl_zipcode text,
    cl_email text,
    cl_phone text,
    cl_phoneextension text,
    cl_mobile text,
    cl_creditlimit text,
    cl_customerdiscount text,
    cl_status text
);