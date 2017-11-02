update product
set pr_jsonb = jsonb_set(pr_jsonb,'{pr_code}', $1::jsonb, true)
where pr_id = $2