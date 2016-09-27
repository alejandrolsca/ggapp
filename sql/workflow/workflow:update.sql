update wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_status}', jsonb $1)
where wo_id in ($2);