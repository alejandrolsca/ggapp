update public.supplier
set su_jsonb = $1
where su_id = $2;