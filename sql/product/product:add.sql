insert into public.product
(pr_jsonb)
values ($1)
returning pr_jsonb->>'cl_id' as cl_id, pr_jsonb->>'pr_process' as pr_process, pr_jsonb->>'pr_type' as pr_type, pr_id;