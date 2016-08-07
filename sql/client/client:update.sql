update public.client
set cl_jsonb = $1
where cl_id = $2;