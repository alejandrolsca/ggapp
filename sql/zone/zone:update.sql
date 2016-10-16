update public.zone
set zo_jsonb = $1
where zo_id = $2;