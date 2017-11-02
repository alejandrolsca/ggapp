update material
set mt_jsonb = jsonb_set(mt_jsonb,'{mt_code}', $1::jsonb, true)
where mt_id = $2