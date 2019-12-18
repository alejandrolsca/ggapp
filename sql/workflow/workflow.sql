select
	wo_type,
	pr_process,
	wo_id,
	wo_commitmentdate,
	cl.cl_id,
	case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	pr_code,
    pr_name,
    pr.pr_material,
    pr.pr_material pr_materialraw,
	pr.pr_components,
    pr.pr_concept,
	pr.pr_jsonb,
	ma.ma_name,
	zo.zo_zone,
	wo_release,
    wo_po,
	wo_line,
	wo_linetotal,
	wo_qty,
	wo_componentmaterialqty,
	wo_materialqty,
	wo_packageqty,
	wo_boxqty,
	wo_foliosperformat, 
	wo_foliosseries, 
	wo_foliosfrom, 
	wo_foliosto,
	wo_deliverydate,  
	wo_previousid, 
	wo_previousdate, 
	wo_price, 
	wo_currency, 
	wo_notes,
	wo_cancellationnotes,
	case wo_status
		when 0 then '(0) Activo'
		when 1 then '(1) En espera de material'
		when 2 then '(2) Material disponible'
		when 3 then '(3) En producción'
		when 4 then '(4) Detenido en Producción'
		when 5 then '(5) Acabados'
		when 6 then '(6) Detenido en Acabados'
		when 7 then '(7) Terminado'
		when 8 then '(8) Departamento de calidad'
		when 9 then '(9) Rechazado por calidad'
		when 10 then '(10) Aprobado por calidad'
		when 11 then '(11) Empaque'
		when 12 then '(12) Inspección Final'
		when 13 then '(13) Facturación/Lista de Embarque'
		when 14 then '(14) Enviado'
		when 15 then '(15) No se pudo entregar'
		when 16 then '(16) Rechazado por el cliente'
		when 17 then '(17) Entregada'
		when 18 then '(18) Cancelada'
	end as wo_status,
	wo_updatedby,         
	wo_createdby,
    to_char((wo.wo_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_date,
	to_char((wo.wo_lastupdated at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_lastupdated,
    file1,
    file2,
	case 
		when jsonb_typeof(pr_inkfront) = 'object'
		then (
			select 
				array_to_string(array_agg(value),',')
			from (
				select 
					(jsonb_each(pr_inkfront)).value
			) in_id
		) 
		else (
			select pr_inkfront::text
		)
	end as inkfront,
	case 
		when pr_jsonb ? 'pr_components' 
		then (
			select 
				array_to_string(array_agg((select array_to_string(array_agg(x.value),',') from (select (jsonb_each(in_id.value)).value) x)),',')
			from (
				select 
					(jsonb_each(pr_inksfront)).value
			) in_id
		) 
		when jsonb_typeof(pr_inksfront) = 'object'
		then (
			select 
				array_to_string(array_agg(value),',')
			from (
				select 
					(jsonb_each(pr_inksfront)).value
			) in_id
		)
		else (
			select pr_inksfront::text
		)
	end as inksfront,
	case 
		when jsonb_typeof(pr_inkback) = 'object'
		then (
			select 
				array_to_string(array_agg(value),',')
			from (
				select 
					(jsonb_each(pr_inkback)).value
			) in_id
		) 
		else (
			select pr_inkback::text
		)
	end as inkback,
	case 
		when pr_jsonb ? 'pr_components' 
		then (
			select 
				array_to_string(array_agg((select array_to_string(array_agg(x.value),',') from (select (jsonb_each(in_id.value)).value) x)),',')
				--array_to_string(array_agg(value),',')
			from (
				select 
					(jsonb_each(pr_inksback)).value
			) in_id
		) 
		when jsonb_typeof(pr_inksback) = 'object'
		then (
			select 
				array_to_string(array_agg(value),',')
			from (
				select 
					(jsonb_each(pr_inksback)).value
			) in_id
		)
		else (
			select pr_inksback::text
		)
	end as inksback
from 
	wo wo, 
	jsonb_to_record(wo.wo_jsonb) as wo_jsonb (
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
		wo_componentmaterialqty jsonb, 
		wo_materialqty decimal, 
        wo_packageqty int, 
        wo_excedentqty int, 
        wo_boxqty int,
        wo_foliosperformat int, 
        wo_foliosseries text, 
        wo_foliosfrom int, 
        wo_foliosto int, 
        wo_type text,
        wo_commitmentdate date,
        wo_deliverydate timestamp,  
        wo_previousid int, 
        wo_previousdate date, 
        wo_notes text, 
        wo_cancellationnotes text, 
        wo_price text, 
        wo_currency text, 
        wo_email text, 
        wo_status int,
        wo_updatedby text,               
        wo_createdby text,
        file1 text,
        file2 text
	),
	(
		select 
		*,
		case 
			when jsonb_typeof(pr_jsonb->'mt_id') = 'object'
			then (
				select 
					array_to_string(
						array_agg(
							(mt_jsonb->>'mt_code') || ' ' ||
							(mt_jsonb->>'mt_width') || 'x' ||
							(mt_jsonb->>'mt_height') || 
							(mt_jsonb->>'mt_measure') || ' ' ||
							(
										case 
											when mt_jsonb->>'mt_measure' = 'in'
											then round((((mt_jsonb->>'mt_width')::decimal*2.54)*((mt_jsonb->>'mt_height')::decimal*2.54))/10000,2)
											else round(((mt_jsonb->>'mt_width')::decimal*(mt_jsonb->>'mt_height')::decimal)/10000,2)
										end
							)  || 'm2'  || ' ' ||
							(mt_jsonb->>'mt_description')
						),'|'
					) as material
				from (
					select *
					from   material 
					join   unnest(string_to_array((select 
						array_to_string(array_agg(mt.value),',')
					from (
						select 
							(jsonb_each(pr.pr_jsonb->'mt_id')).*
					) mt),',')::int[]) with ordinality t(mt_id, ord) using (mt_id)
					order by t.ord
				) mt
			)
			else (
				select 
					(mt_jsonb->>'mt_code') || ' ' ||
					(mt_jsonb->>'mt_width') || 'x' ||
					(mt_jsonb->>'mt_height') || 
					(mt_jsonb->>'mt_measure') || ' ' ||
					(
								case 
									when mt_jsonb->>'mt_measure' = 'in'
									then round((((mt_jsonb->>'mt_width')::decimal*2.54)*((mt_jsonb->>'mt_height')::decimal*2.54))/10000,2)
									else round(((mt_jsonb->>'mt_width')::decimal*(mt_jsonb->>'mt_height')::decimal)/10000,2)
								end
					) || 'm2'  || ' ' ||
					(mt_jsonb->>'mt_description')
				from material 
				where mt_id = (pr.pr_jsonb->>'mt_id')::integer
			)
		end as pr_material
		from  public.product pr, 
		jsonb_to_record(pr_jsonb) as x (
			cl_id int,
			pr_partno text,
			pr_code text,
			pr_name text,
			pr_process text,
			pr_type text,
			pr_components int,
			pr_concept text,
			pr_folio text,
			pr_status text,
			pr_inkfront jsonb,
			pr_inksfront jsonb,
			pr_inkback jsonb,
			pr_inksback jsonb
		)
	) pr,
	(
		select * from client
	) cl,
	(
		select zo_id, zo_zone from zone, jsonb_to_record(zo_jsonb) as zo_jsonb (
			zo_zone text
		)
	) zo,
	(
		select ma_id, ma_name from machine, jsonb_to_record(ma_jsonb) as ma_jsonb (
			ma_name text
		)
	) ma
where wo_status = $1
and wo_date > (now()::date - $2::interval)
and wo_jsonb.pr_id = pr.pr_id
and wo_jsonb.cl_id = cl.cl_id
and wo_jsonb.zo_id = zo.zo_id
and wo_jsonb.ma_id = ma.ma_id