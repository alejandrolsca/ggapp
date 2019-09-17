select 
    ei.ei_id,
    ei.ei_id,
    ei.zo_id,
    ei.wo_id,
    ei.ei_createdby,
    to_char((ei.ei_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as ei_date,
    zo.zo_jsonb->>'zo_zone' as zo_zone,
    ei_jsonb ? 'ei_cancelled' as ei_cancelled,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename
from  (
	select 
		*
	from  exportationinvoice,  
    jsonb_to_record(ei_jsonb) as ei_jsonb (
            cl_id int,
            zo_id int,
            wo_id text,
            ei_createdby text
    )
) ei
left join client cl
on ei.cl_id = cl.cl_id
left join zone zo
on ei.zo_id = zo.zo_id
where ei.cl_id = $1
order by ei.ei_date desc
limit 5000;