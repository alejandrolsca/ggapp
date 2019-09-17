update wo
set wo_jsonb = wo_jsonb || jsonb_build_object('wo_status', $1::int) || jsonb_build_object('wo_updatedby', $2::text) || jsonb_build_object('wo_cancellationnotes', $3::text) 
where wo_id = any(string_to_array($4,',')::integer[])