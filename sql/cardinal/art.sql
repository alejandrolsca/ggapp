select
	wo_id,
	pr_process,
	pr_code,
    pr_name,
	wo_qty,
    file1,
    file2
from 
	wo wo, 
	jsonb_to_record(wo.wo_jsonb) as wo_jsonb (
		cl_id int,
		pr_id int,
        wo_qty int,
        file1 text,
        file2 text,
		wo_status int
	)
join product pr
on wo_jsonb.pr_id = pr.pr_id,
jsonb_to_record(pr_jsonb) as x (
	pr_code text,
	pr_name text,
	pr_process text
)
where wo_status not in (18)
and wo_date > (now()::date - '3 month'::interval)
and wo_jsonb.cl_id = 1
order by wo_id desc