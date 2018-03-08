select 
    cl.cl_id,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
    cl.cl_jsonb,
    cl.cl_date
    
from  client cl, jsonb_to_record(cl_jsonb) as cl_jsonb (
    cl_status text
)
where cl_id = $1
and cl_status = any(string_to_array($2,',')::text[]);