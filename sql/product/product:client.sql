select
    cl_jsonb
from  public.client
where cl_id = $1;