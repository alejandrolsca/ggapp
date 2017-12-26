update wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_deliverydate}', to_jsonb(now()))
where wo_id = any(string_to_array($1,',')::integer[])