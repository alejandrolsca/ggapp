update public.wo
set wo_jsonb = wo_jsonb || ($1::text)::jsonb
where wo_id = $2
returning wo_id, wo_jsonb, wo_date, wo_lastupdated;