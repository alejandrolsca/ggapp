select 
    *
from  wo
where wo_jsonb->>'cl_id' = $1
and wo_id = $2;