CREATE OR REPLACE FUNCTION wo_after_update()
	RETURNS trigger AS
$BODY$
BEGIN
	UPDATE wo
	SET wo_jsonb = jsonb_set(wo_jsonb,'{wo_updatedate}',to_jsonb(now()), true)
	WHERE wo_id = NEW.wo_id;
	RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql;