ALTER TABLE shippinglist
ADD CONSTRAINT shippinglist_required CHECK (
		sl_jsonb ? 'cl_id' 
	AND sl_jsonb ? 'zo_id' 
	AND sl_jsonb ? 'wo_id' 
	AND sl_jsonb ? 'sl_createdby'
);

ALTER TABLE shippinglist
ADD CONSTRAINT shippinglist_valid_types CHECK (
		jsonb_typeof(sl_jsonb->'cl_id')='number'
	AND jsonb_typeof(sl_jsonb->'zo_id')='number'
	AND jsonb_typeof(sl_jsonb->'wo_id')='string'
	AND jsonb_typeof(sl_jsonb->'sl_createdby')='string'
);