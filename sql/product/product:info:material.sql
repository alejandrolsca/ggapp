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
	) || 'm2'  || ' ' ||
	(mt_jsonb->>'mt_description')  as material
from material 
where mt_id = $1
and mt_jsonb->>'mt_status' = $2