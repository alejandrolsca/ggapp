update wo
set wo_jsonb = wo_jsonb || jsonb_build_object('wo_status', wohi.wo_status)
from (
select distinct on (wo_id) wo_id, wohi_prevjsonb->'wo_status' wo_status
from wohistory 
order by wo_id, wohi_date desc
) wohi
where wo.wo_id = wohi.wo_id;