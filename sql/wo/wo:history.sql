select
	wohi.wo_id,
	wohi.wohi_newjsonb->'wo_createdby' wo_createdby,
	to_char((wo.wo_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_created,
	wohi.wohi_newjsonb->'wo_updatedby' wo_updatedby,
	to_char((wohi.wohi_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_updated,
	wohi.wohi_prevjsonb->'wo_status' old_status,
	wohi.wohi_newjsonb->'wo_status' new_status
from wohistory wohi
left join wo wo
on wohi.wo_id = wo.wo_id
where wohi.wo_id = $1
order by wohi.wohi_id asc