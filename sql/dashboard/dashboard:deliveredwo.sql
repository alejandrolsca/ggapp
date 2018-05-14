select
	pjb.pr_process,
	count(wo_deliverydate) as delivered,
	count(pjb.pr_process) as total,
	((count(wo_deliverydate)::numeric * 100) / count(pjb.pr_process)::numeric)::decimal(5,2) as percentage
from wo wo,
jsonb_to_record(wo_jsonb) as wjb (
	pr_id int,
	wo_status text,
	wo_commitmentdate date,
	wo_deliverydate timestamptz
)
join product pr
on wjb.pr_id = pr.pr_id,
jsonb_to_record(pr_jsonb) as pjb (
	pr_process text
)
where wjb.wo_commitmentdate between $1 and $2
group by pjb.pr_process