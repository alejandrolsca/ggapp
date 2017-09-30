update public.material
SET mt_jsonb = REPLACE(mt_jsonb::TEXT,'pa_','mt_')::JSON
returning *;