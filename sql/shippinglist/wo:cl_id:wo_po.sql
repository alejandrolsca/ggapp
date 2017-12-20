select
    wo.wo_id,
	wo_jsonb.wo_qty,
	pr_jsonb.pr_name,
	pr_jsonb.pr_weight,
	wo_jsonb.wo_po,
	wo_jsonb.wo_release,
	now()
from  wo wo
join product pr
on wo.wo_jsonb->>'pr_id' = pr.pr_id::text,
jsonb_to_record(wo_jsonb) as wo_jsonb (
    wo_qty int,
	wo_partno text,
	wo_po text,
	wo_release text
),
jsonb_to_record(pr_jsonb) as pr_jsonb (
		pr_name text,
        pr_weight decimal
)
where wo_jsonb->>'cl_id' = $1
and wo_jsonb->'wo_status' between '13' and '17'
and wo_jsonb->>'wo_po' = $2
union all
select
    null,
	null,
	'TOTAL',
	sum(wo_jsonb.wo_qty * pr_jsonb.pr_weight),
	null,
	null,
	null
from  wo wo
join product pr
on wo.wo_jsonb->>'pr_id' = pr.pr_id::text,
jsonb_to_record(wo_jsonb) as wo_jsonb (
    wo_qty int
),
jsonb_to_record(pr_jsonb) as pr_jsonb (
        pr_weight decimal
)
where wo_jsonb->>'cl_id' = $1
and wo_jsonb->'wo_status' between '13' and '17'
and wo_jsonb->>'wo_po' = $2
order by 1 asc

