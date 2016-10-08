update wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_status}', $1)
where wo_id = any(string_to_array($2,',')::integer[])