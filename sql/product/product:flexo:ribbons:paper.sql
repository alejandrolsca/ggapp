select
    *
from  public.paper, 
jsonb_to_record(pa_jsonb) as x (
    su_id text,
    pa_code text,
    pa_type text,
    pa_description text,
    pa_width text,
    pa_height text,
    pa_weight text,
    pa_measure text,
    pa_price text,
    pa_status text
)
where pa_jsonb->>'pa_type'='ribbon' and
pa_jsonb->>'pa_status'='A';