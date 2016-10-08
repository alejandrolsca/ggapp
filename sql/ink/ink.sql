select 
    *
from  public.ink, 
jsonb_to_record(in_jsonb) as x (
    su_id text,
    in_code text,
    in_type text,
    in_description text,
    in_weight text,
    in_width text,
    in_height text,
    in_price text,
    in_status text
);