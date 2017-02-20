select
	wo.wo_id,
    pr.pr_id,
	pr_jsonb.pr_name,
    wo_jsonb.wo_release,
    wo_jsonb.wo_po,
	wo_jsonb.wo_line,
    wo_jsonb.wo_linetotal,
	wo_jsonb.wo_qty,
	wo_jsonb.wo_price,
	wo_jsonb.wo_currency,	
	pr_jsonb.pr_description,
	pr_jsonb.pr_language,
	pr_jsonb.pr_weight,
	(wo_jsonb.wo_qty * pr_jsonb.pr_weight)::decimal as total_weight,
	(wo_jsonb.wo_qty * wo_jsonb.wo_price)::decimal as total_price
from  wo wo
join product pr
on wo_jsonb->>'pr_id' = pr.pr_id::text,
jsonb_to_record(wo_jsonb) as wo_jsonb (
        wo_release text,
        wo_po text,
		wo_line integer,
		wo_linetotal integer,
        wo_qty int,
        wo_price decimal, 
        wo_currency text,
        wo_status text
),
jsonb_to_record(pr_jsonb) as pr_jsonb (
		pr_name text,
		pr_description text,
		pr_language text,
        pr_weight decimal
)
where wo_jsonb->>'cl_id' = $1
and wo_jsonb->>'wo_release' = $2;