update public.material
set mt_jsonb = $1
where mt_id = $2;