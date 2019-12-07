select
	wo_jsonb.*
from  wo, jsonb_to_record(wo_jsonb) wo_jsonb (
	file1 text,
	file2 text,
	wo_status integer
) 
where wo_id = $1;