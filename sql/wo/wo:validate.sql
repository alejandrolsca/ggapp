select 
    wo_id,
	wo_jsonb,
	wo_date,
	wo_lastupdated
from  wo, jsonb_to_record(wo_jsonb) wo_jsonb (
	cl_id integer
) 
where wo_jsonb.cl_id = $1
and wo_id = $2;