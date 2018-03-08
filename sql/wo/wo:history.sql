select
	wohi.wo_id,
	wohi.wohi_newjsonb->'wo_createdby' wo_createdby,
    wo.wo_date wo_created, 
	wohi.wohi_newjsonb->'wo_updatedby' wo_updatedby,
	wohi.wohi_newjsonb->'wo_updated' wo_updated,
	wohi.wohi_prevjsonb->'wo_status' old_status,
	wohi.wohi_newjsonb->'wo_status' new_status
from wohistory wohi
left join wo wo
on wohi.wo_id = wo.wo_id
where wohi.wo_id = $1
order by wohi.wohi_id asc