select 
    sl.*,
    zo.zo_jsonb->>'zo_zone' as zo_zone,
    sl_jsonb ? 'sl_cancelled' as sl_cancelled,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename
from  (
	select 
		*
	from  shippinglist,  
    jsonb_to_record(sl_jsonb) as sl_jsonb (
            cl_id int,
            zo_id int,
            wo_id text,
            sl_createdby text
    )
) sl
left join client cl
on sl.cl_id = cl.cl_id
left join zone zo
on sl.zo_id = zo.zo_id
where sl.cl_id = $1
order by sl.sl_date desc
limit 5000;