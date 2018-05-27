ALTER TABLE wo
ADD CONSTRAINT validate_wo_status CHECK (jsonb_typeof(wo_jsonb->'wo_status')='number');

ALTER TABLE wo
ADD CONSTRAINT exists_wo_status CHECK (wo_jsonb ? 'wo_status');