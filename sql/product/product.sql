select
	pr.pr_id, 
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	case 
			when jsonb_typeof(pr_jsonb->'mt_id') = 'object'
			then (
				select 
					array_to_string(
						array_agg(
							concept_value::text || ': ' ||
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
						),'<br>'
					) as material
				from (
					select *
					from   
						material mt
					join (
						select 
							t1.key as concept_key,
							t1.value concept_value,
							t2.key material_key,
							t2.value material_value
						from (
						select (jsonb_each(pr.pr_jsonb->'pr_concept')).*
						) t1

						join (
						select (jsonb_each(pr.pr_jsonb->'mt_id')).*
						) t2

						on t1.key = t2.key
					) t3

					on mt.mt_id = (t3.material_value)::text::int
					order by material_key asc
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
		end as pr_material,
    x.*,
	(
		select 
			max(wo_id)
		from wo
		where (wo_jsonb->>'pr_id')::integer = pr.pr_id
	) as wo_previousid,
	to_char((pr.pr_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as pr_date
from  public.product pr, 
jsonb_to_record(pr_jsonb) as x (
    cl_id int,
    pr_partno text,
    pr_code text,
    pr_name text,
    pr_process text,
    pr_type text,
    pr_folio text,
	pr_weight decimal,		
    pr_status text
)
left join client cl
on x.cl_id = cl.cl_id
where x.cl_id = $1;