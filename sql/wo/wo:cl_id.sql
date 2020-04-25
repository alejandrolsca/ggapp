 select 
	wo.wo_id,
	wo.cl_id,
	wo.zo_id,
	wo.wo_orderedby,
	wo.wo_attention, 
	wo.ma_id, 
	wo.wo_release,
	wo.wo_po, 
	wo.wo_line,
	wo.wo_linetotal,
	wo.pr_id,
	wo.wo_qty, 
	wo.wo_qtymeasure, 
	wo.wo_originalqty, 
	wo.wo_packageqty, 
	wo.wo_excedentqty, 
	wo.wo_foliosperformat, 
	wo.wo_foliosseries, 
	wo.wo_foliosfrom, 
	wo.wo_foliosto, 
	wo.wo_originalfoliosto, 
	wo.wo_type,
	wo.wo_commitmentdate,
	wo.wo_deliverydate, 
	wo.wo_previousid, 
	wo.wo_previousdate, 
	wo.wo_notes,
	wo.wo_cancellationnotes,
	wo.wo_splitnotes,
	wo.wo_price, 
	wo.wo_currency, 
	wo.wo_email, 
	wo.wo_status,
	wo.wo_createdby, 
	wo.wo_updatedby,
	wo.file1,
	wo.file2,
	wo.wo_split,
	wo_exportationinvoice,
	wo_shippinglist,
	to_char((wo_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_date,
	to_char((wo_lastupdated at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_lastupdated,
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
		wo_id,
		wo_jsonb.*,
		wo_date,
		wo_lastupdated
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
			wo_qtymeasure text,
			wo_originalqty int,
            wo_packageqty int, 
            wo_excedentqty int, 
            wo_foliosperformat int, 
            wo_foliosseries text, 
            wo_foliosfrom int, 
            wo_foliosto int, 
			wo_originalfoliosto int,
            wo_type text,
            wo_commitmentdate timestamp,
            wo_deliverydate timestamp, 
            wo_previousid int, 
            wo_previousdate timestamp, 
            wo_notes text,
			wo_cancellationnotes text,
			wo_splitnotes text,
            wo_price text, 
            wo_currency text, 
            wo_email text, 
            wo_status int,
            wo_createdby text, 
            wo_updatedby text,
            file1 text,
            file2 text,
			wo_split boolean,
			wo_exportationinvoice boolean,
			wo_shippinglist boolean
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
order by wo.wo_date desc;
      