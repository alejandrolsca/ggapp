update public.product
set pr_jsonb = jsonb_set(pr_jsonb,'{pr_status}','"A"')
where pr_id = 1