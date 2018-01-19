select
	case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	zo.zo_zone,
	ma.ma_name,
    wo.wo_id,
	wo.wo_jsonb,
	wo_date,
	pr.*
from 
	wo wo, 
	jsonb_to_record(wo.wo_jsonb) as wo_jsonb (
		cl_id int,
		zo_id int,
		ma_id int,
		pr_id int
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
						),','
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
			pr_concept text,
			pr_folio text,
			pr_status text
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
where wo.wo_id = any(string_to_array($1,',')::int[])
and wo_jsonb.pr_id = pr.pr_id
and wo_jsonb.cl_id = cl.cl_id
and wo_jsonb.zo_id = zo.zo_id
and wo_jsonb.ma_id = ma.ma_id