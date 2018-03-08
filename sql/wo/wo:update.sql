update public.wo
set wo_jsonb = $1 || jsonb_build_object('wo_updated', now())
where wo_id = $2;