insert into public.wo
(wo_jsonb)
values ($1::jsonb - '{wo_updated,wo_updatedby}'::text[])
returning wo_id;