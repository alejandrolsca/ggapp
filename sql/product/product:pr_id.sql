select
    cl.cl_id,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
    pr_jsonb
from  public.product, jsonb_to_record(pr_jsonb) as pr_jsonb (
    cl_id int
)
inner join client cl
on pr_jsonb.cl_id = cl.cl_id
where pr_id = $1;