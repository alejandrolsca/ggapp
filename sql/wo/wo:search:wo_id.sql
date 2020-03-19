select 
    wo_id,
	wo_jsonb,
	wo_date,
	wo_lastupdated
from  wo 
where wo_id::text ilike  ('%' || $1 || '%')
order by wo_id desc
limit 10