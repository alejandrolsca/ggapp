insert into public.material
(mt_jsonb)
values ($1)
returning mt_jsonb->>'su_id' as su_id, mt_jsonb->>'mt_type' as mt_type, mt_id;