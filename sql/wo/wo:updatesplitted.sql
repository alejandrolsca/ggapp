update public.wo
set wo_jsonb = wo_jsonb || 
jsonb_build_object('wo_qty', $1::int) || 
jsonb_build_object('wo_originalqty', $2::int) || 
jsonb_build_object('wo_foliosto', ($3::int)-($1::int)) ||
jsonb_build_object('wo_originalfoliosto', $3::int) ||
jsonb_build_object('wo_split', true)
where wo_id = $4;