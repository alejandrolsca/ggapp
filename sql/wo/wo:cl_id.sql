select 
    wo.*,
    wo_jsonb ? 'wo_exportationinvoice' as wo_exportationinvoice,
    wo_jsonb ? 'wo_shippinglist' as wo_shippinglist,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	pr.pr_jsonb->>'pr_code' as pr_code,
	pr.pr_jsonb->>'pr_name' as pr_name,
	pr.pr_jsonb->>'pr_weight' as pr_weight,
	pr.pr_jsonb->>'pr_partno' as pr_partno,
    ma.ma_jsonb->>'ma_name' as ma_name,
	zo.zo_jsonb->>'zo_zone' as zo_zone
from  (
	select 
		*
	from  wo,  
    jsonb_to_record(wo_jsonb) as wo_jsonb (
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
            wo_commitmentdate timestamp,
            wo_deliverydate timestamp, 
            wo_previousid int, 
            wo_previousdate timestamp, 
            wo_notes text, 
            wo_price text, 
            wo_currency text, 
            wo_email text, 
            wo_status int,
            wo_createdby text, 
            wo_updatedby text,
            wo_updated text,
            file1 text,
            file2 text
    )
) wo
left join client cl
on wo.cl_id = cl.cl_id
left join product pr
on wo.pr_id = pr.pr_id
left join zone zo
on wo.zo_id = zo.zo_id
left join machine ma
on wo.ma_id = ma.ma_id
where wo.cl_id = $1
order by wo.wo_date desc
limit 5000;