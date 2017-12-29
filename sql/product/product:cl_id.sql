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
    pr_status text
)
where pr_jsonb->>'cl_id' = $1
and pr_jsonb->>'pr_status' = $2;