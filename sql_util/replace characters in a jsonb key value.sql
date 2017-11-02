update material
set mt_jsonb = jsonb_set(mt_jsonb,'{mt_code}', to_jsonb(replace(mt_jsonb#>>'{mt_code}','-','')),false)

