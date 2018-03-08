update public.product
set pr_jsonb = $1
where pr_id = $2;