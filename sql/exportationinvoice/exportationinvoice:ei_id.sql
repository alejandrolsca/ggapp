select
ei.ei_id,
ei_jsonb.*,
ei.ei_date
from exportationinvoice ei, jsonb_to_record(ei_jsonb) as ei_jsonb (
    cl_id int,
    zo_id int,
    wo_id text,
    ei_cancelled boolean,
    ei_createdby text
)
where ei.ei_id = $1;