update public.machine
set ma_jsonb = $1
where ma_id = $2;