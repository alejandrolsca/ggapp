insert into public.material
(mt_jsonb)
values ($1)
returning mt_id;