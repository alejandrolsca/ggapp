select
    pr_jsonb
from  public.product
where pr_id = $1;