update public.wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_deliverydate}', '"2017-10-22T00:00:00.000000-05:00"', true)
where wo_id = 2