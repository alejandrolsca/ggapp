select
    *
from  public.ink, 
jsonb_to_record(in_jsonb) as x (
    in_code text
)
where in_jsonb->>'in_type' = $1
and in_jsonb->>'in_status'='A'
order by in_code asc;