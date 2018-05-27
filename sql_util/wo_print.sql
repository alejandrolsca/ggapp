select
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
				array_to_string(array_agg((select array_to_string(array_agg(x.value),',') from (select (jsonb_each(in_id.value)).value) x)),'|')
				--array_to_string(array_agg(value),',')
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
				array_to_string(array_agg((select array_to_string(array_agg(x.value),',') from (select (jsonb_each(in_id.value)).value) x)),'|')
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
	end as inksback,
    wo.wo_id,
	wo.wo_jsonb,
	wo_date,
	pr.*
from  
	wo wo, 
	jsonb_to_record(wo.wo_jsonb) as wo_jsonb (
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
						),', '
					) as material
				from (
					select *
					from   material 
					join   unnest(string_to_array((select 
						array_to_string(array_agg(mt.value),', ')
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
			pr_status text,
			pr_inkfront jsonb,
			pr_inksfront jsonb,
			pr_inkback jsonb,
			pr_inksback jsonb
		)
	) pr
where wo.wo_id = any(string_to_array('1,2,3,4,5,6,7,11,12,14,15,16,23,25',',')::int[])
and wo_jsonb.pr_id = pr.pr_id;