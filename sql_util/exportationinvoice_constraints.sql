ALTER TABLE exportationinvoice
ADD CONSTRAINT exportationinvoice_required CHECK (
		ei_jsonb ? 'cl_id' 
	AND ei_jsonb ? 'zo_id' 
	AND ei_jsonb ? 'wo_id' 
	AND ei_jsonb ? 'ei_createdby'
);

ALTER TABLE exportationinvoice
ADD CONSTRAINT exportationinvoice_valid_types CHECK (
		jsonb_typeof(ei_jsonb->'cl_id')='number'
	AND jsonb_typeof(ei_jsonb->'zo_id')='number'
	AND jsonb_typeof(ei_jsonb->'wo_id')='string'
	AND jsonb_typeof(ei_jsonb->'ei_createdby')='string'
);