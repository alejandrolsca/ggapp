select
sl.sl_id,
sl_jsonb.*,
to_char((sl.sl_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as sl_date
from shippinglist sl, jsonb_to_record(sl_jsonb) as sl_jsonb (
    cl_id int,
    zo_id int,
    wo_id text,
    sl_cancelled boolean,
    sl_createdby text
)
where sl.sl_id = $1;