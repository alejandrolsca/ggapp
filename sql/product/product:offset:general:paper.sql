select
    *
from  public.paper, 
jsonb_to_record(pa_jsonb) as x (
    pa_code text
)
where pa_jsonb->>'pa_status'='A';