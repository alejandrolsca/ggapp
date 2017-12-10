select
    pr_jsonb.pr_partno,
	pr_jsonb.pr_language,
	wo_jsonb.wo_qty,
	'PIEZAS' as wo_unitmeasure,
	pr_jsonb.pr_weight,
	pr_jsonb.pr_weight as pr_grossweight,
	wo_jsonb.wo_price,
	(wo_jsonb.wo_qty * wo_jsonb.wo_price)::decimal as total_price,
	tc_id,
	tc_jsonb.tc_code,
	tc_jsonb.tc_description
from  wo wo
join product pr
on wo_jsonb->>'pr_id' = pr.pr_id::text
left join tariffcode tc
on pr.pr_jsonb->>'tc_id' = tc.tc_id::text,
jsonb_to_record(wo_jsonb) as wo_jsonb (
        wo_qty int,
        wo_price decimal
),
jsonb_to_record(pr_jsonb) as pr_jsonb (
		pr_partno text,
		pr_language text,
        pr_weight decimal
),
jsonb_to_record(tc_jsonb) as tc_jsonb (
		tc_code text,
		tc_description text
)
where wo_jsonb->>'cl_id' = $1
and wo_id = any(string_to_array($2,',')::integer[])
union all
select
    null,
    'TOTAL FRACCION',
	sum(wo_jsonb.wo_qty),
	null,
	(sum(wo_jsonb.wo_qty * pr_jsonb.pr_weight))::decimal,
	(sum(wo_jsonb.wo_qty * pr_jsonb.pr_weight))::decimal,
	null,
	(sum(wo_jsonb.wo_qty * wo_jsonb.wo_price))::decimal,
	tc_id,
	null,
	null
from  wo wo
join product pr
on wo_jsonb->>'pr_id' = pr.pr_id::text
left join tariffcode tc
on pr.pr_jsonb->>'tc_id' = tc.tc_id::text,
jsonb_to_record(wo_jsonb) as wo_jsonb (
        wo_qty int,
        wo_price decimal
),
jsonb_to_record(pr_jsonb) as pr_jsonb (
        pr_weight decimal
),
jsonb_to_record(tc_jsonb) as tc_jsonb (
		tc_code text,
		tc_description text
)
where wo_jsonb->>'cl_id' = $1
and wo_id = any(string_to_array($2,',')::integer[])
group by tc_id
order by 9,10

