insert into public.product
(pr_jsonb)
values ($1)
returning pr_id;