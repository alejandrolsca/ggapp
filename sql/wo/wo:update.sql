update public.wo
set wo_jsonb = wo_jsonb || ($1::text)::jsonb
where wo_id = $2;