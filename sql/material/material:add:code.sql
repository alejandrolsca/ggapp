update material
set mt_jsonb = jsonb_set(mt_jsonb,'{mt_code}', to_jsonb('M' || '-' || lpad((mt_jsonb#>>'{su_id}'),3,'0') || '-' || lpad(mt_id::text,5,'0')) ,true)
where mt_id = $1