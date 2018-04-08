update exportationinvoice
set ei_jsonb = ei_jsonb || jsonb_build_object('ei_cancelled', true)
where ei_id = $1
returning ei_id;