Select 
	pr.key,
	pr.value,
	case
		when pr.key = 'mt_id'
		then (
			select 
				(mt_jsonb->>'mt_code') || ' ' ||
				(mt_jsonb->>'mt_width') || 'x' ||
				(mt_jsonb->>'mt_height') || 
				(mt_jsonb->>'mt_measure') || ' ' ||
				(
							case 
								when mt_jsonb->>'mt_measure' = 'in'
								then round((((mt_jsonb->>'mt_width')::decimal*2.54)*((mt_jsonb->>'mt_height')::decimal*2.54))/100,2)
								else round(((mt_jsonb->>'mt_width')::decimal*(mt_jsonb->>'mt_height')::decimal)/100,2)
							end
				)  || 'm2'  || ' ' ||
				(mt_jsonb->>'mt_description') 
			from material 
			where to_jsonb(mt_id) = pr.value
		)
		when pr.key = 'pr_inksback'
		then (
			select array_to_string(array_agg(in_jsonb->>'in_code'),',') from ink where in_id = any (
				('{'||coalesce((select 
					array_to_string(array_agg(ink.value),',')
				from (
					select 
						(jsonb_each(pr.value)).*
				) ink),'')||'}')::int[]
			)
		)
		when pr.key = 'pr_inksfront'
		then (
			select array_to_string(array_agg(in_jsonb->>'in_code'),',') from ink where in_id = any (
				('{'||coalesce((select 
					array_to_string(array_agg(ink.value),',')
				from (
					select 
						(jsonb_each(pr.value)).*
				) ink),'')||'}')::int[]
			)
		)
		else pr.value::text
	end as final_value
from (
	select 
		(jsonb_each(pr_jsonb)).*
	from product
	where pr_id = 2
) pr