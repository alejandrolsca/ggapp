select 
	*
from  public.supplier, 
jsonb_to_record(su_jsonb) as x (
	su_corporatename text
)
where su_jsonb->>'su_status'='A'