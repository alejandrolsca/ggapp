select 
    *
from  public.product, 
jsonb_to_record(pr_jsonb, true) as x (
    cl_id text,
    pr_partno text,
    pr_code text,
    pr_name text,
    pr_process text,
    pr_type text,
    pr_folio text,
    pr_status text
)
where pr_jsonb->>'cl_id' = $1
and pr_jsonb->>'pr_status' = $2;