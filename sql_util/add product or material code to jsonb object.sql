update product
set pr_jsonb = jsonb_set(pr_jsonb,'{pr_code}', to_jsonb('P' || '-' || lpad((pr_jsonb#>>'{cl_id}'),4,'0')  || '-' || lpad(pr_id::text,7,'0') || '-' || (pr_jsonb#>>'{pr_process}') || '-' || (pr_jsonb#>>'{pr_type}')) ,true)
/*
update material
set mt_jsonb = jsonb_set(mt_jsonb,'{mt_code}', to_jsonb('M' || '-' || lpad((mt_jsonb#>>'{su_id}'),3,'0') || '-' || lpad(mt_id::text,5,'0')) ,true)
*/