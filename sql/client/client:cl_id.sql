select 
    *
from  public.client
where cl_id = $1
and cl_jsonb->>'cl_status' = any(string_to_array($2,',')::text[]);