update public.wo
set wo_jsonb = $1
where wo_id = $2;