select 
	wo.*,
	ma.ma_jsonb->>'ma_name' ma_name,
	case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	cl.cl_jsonb->>'cl_name' as cl_name,
    cl.cl_jsonb->>'cl_firstsurname' as cl_firstsurname,
    cl.cl_jsonb->>'cl_secondsurname' as cl_secondsurname,
    cl.cl_jsonb->>'cl_type' as cl_type,
	pr.pr_jsonb->>'pr_name' as pr_name
from (
select 
    *
from  wo, 
	jsonb_to_record(wo_jsonb) as x (
		cl_id int,
		zo_id int,
		wo_orderedby text,
		wo_attention text, 
		ma_id int, 
		wo_release text,
		wo_po text, 
		wo_line int,
		wo_linetotal int,
		pr_id int,
		wo_qty int, 
		wo_packageqty int, 
		wo_excedentqty int, 
		wo_foliosperformat int, 
		wo_foliosseries text, 
		wo_foliosfrom int, 
		wo_foliosto int, 
		wo_type text,
		wo_commitmentdate text,
		wo_deliverydate text,  
		wo_previousid int, 
		wo_previousdate text, 
		wo_notes text, 
		wo_price text, 
		wo_currency text, 
		wo_email text,
		wo_createdby text, 
		wo_updatedby text, 
		wo_updated text, 
		wo_status int
	)
) wo
left join client cl
on wo.cl_id = cl.cl_id
left join product pr
on wo.pr_id = pr.pr_id
left join machine ma
on wo.ma_id = ma.ma_id
where (wo_jsonb->>'wo_status')::int in (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)
and cl.cl_id = $1
order by wo.wo_commitmentdate asc
limit 1000;