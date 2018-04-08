select
sl.sl_id,
sl_jsonb.*,
sl.sl_date
from shippinglist sl, jsonb_to_record(sl_jsonb) as sl_jsonb (
    cl_id int,
    zo_id int,
    wo_id text,
    sl_cancelled boolean,
    sl_createdby text
)
where sl.sl_id = $1;