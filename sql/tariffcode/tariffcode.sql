select
    *
from tariffcode
where tc_jsonb->>'tc_status' = any(string_to_array($1,',')::text[])