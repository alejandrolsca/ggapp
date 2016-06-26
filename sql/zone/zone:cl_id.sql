select 
    *
from  public.zone
where zo_jsonb->>'cl_id' = $1;