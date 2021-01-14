select 
    wo_id
from wo, jsonb_to_record(wo_jsonb) as wojb (
    cl_id int,
    wo_exportationinvoice boolean
)
where cl_id = $1
and wojb.wo_exportationinvoice = true
and wo_id = any(string_to_array($2,',')::int[])