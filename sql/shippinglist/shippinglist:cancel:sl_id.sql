update shippinglist
set sl_jsonb = sl_jsonb || jsonb_build_object('sl_cancelled', true)
where sl_id = $1
returning sl_id;