update product
set pr_jsonb = jsonb_set(pr_jsonb,'{tc_id}',to_jsonb(trunc(random() * 7 + 1)))