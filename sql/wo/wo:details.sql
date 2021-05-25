select
	wo_id,
	case
		when cljb.cl_type = 'natural' 
			then (cljb.cl_name || ' ' || cljb.cl_firstsurname || ' ' || coalesce(cljb.cl_secondsurname,''))
		else cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	zojb.*,
	prjb.*
from wo, jsonb_to_record(wo_jsonb) as wojb (
	cl_id int,
	zo_id int,
	pr_id int
)
join client cl
on wojb.cl_id = cl.cl_id
join product pr
on wojb.pr_id = pr.pr_id
join zone zo
on wojb.zo_id = zo.zo_id,
jsonb_to_record(cl_jsonb) as cljb (
	cl_type text,
	cl_name text,
	cl_firstsurname text,
    cl_secondsurname text
),
jsonb_to_record(pr_jsonb) as prjb (
	pr_name text,
	pr_partno text,
	pr_code text
),
jsonb_to_record(zo_jsonb) as zojb (
	zo_zone text
)
where wo_id = $1;