select
    *
from  public.material, 
jsonb_to_record(mt_jsonb) as x (
    su_id int,
    mt_code text,
    mt_type text,
    mt_description text,
    mt_width text,
    mt_height text,
    mt_weight text,
    mt_measure text,
    mt_price text,
    mt_status text
)
where mt_jsonb->>'mt_type'='ink_pad' and
mt_jsonb->>'mt_status'='A';