select
	cl.cl_jsonb->>'cl_corporatename' as cl_corporatename,
	cl.cl_jsonb->>'cl_name' as cl_name,
    cl.cl_jsonb->>'cl_fatherslastname' as cl_fatherslastname,
    cl.cl_jsonb->>'cl_motherslastname' as cl_motherslastname,
	*
from client cl 
right join lateral (
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
        wo_commitmentdate timestamp, 
        wo_previousid int, 
        wo_previousdate int, 
        wo_notes text, 
        wo_price text, 
        wo_currency text, 
        wo_email text, 
        wo_status text
	)
where wo_jsonb->>'wo_status' = '0'
) wo
on wo.cl_id = cl.cl_id
order by wo.wo_date desc;