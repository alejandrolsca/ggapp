update wo
set wo_jsonb = wo_jsonb #- '{wo_exportationinvoice}'
where wo_id = any(string_to_array($1,',')::integer[]);