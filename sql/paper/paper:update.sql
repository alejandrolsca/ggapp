update public.paper
set pa_jsonb = $1
where pa_id = $2;