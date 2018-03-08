update wo
set wo_jsonb = wo_jsonb || jsonb_build_object($1::text, $2::text)  || jsonb_build_object('wo_updated', now()) || jsonb_build_object('wo_updatedby', $3::text) 
where wo_id = $4;