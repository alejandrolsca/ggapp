CREATE UNIQUE INDEX client_cl_type_cl_tin_unique ON client ((cl_jsonb->>'cl_type'), (cl_jsonb->>'cl_tin'));