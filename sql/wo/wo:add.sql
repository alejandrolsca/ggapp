insert into public.wo
(wo_jsonb)
values ($1)
returning wo_id, wo_jsonb, wo_date, wo_lastupdated;