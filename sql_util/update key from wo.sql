update wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_commitmentdate}',to_jsonb(now()),true)
where wo_id = 4;