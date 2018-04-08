select 
	*
from (
	select
		wo_id,
		ma_id,
		case
		when pr_jsonb ? 'pr_components'
		then (
			select sum(val) from ( 
				select (jsonb_each_text(wo_componentmaterialqty)).value::numeric as val
			) x
		)
		else (
			select wo_materialqty
		)
		end as wo_materialqty,
		case
		when pr_jsonb ? 'pr_components'
		then (
			select sum(val) from ( 
				select (jsonb_each_text(pr_inkfront)).value::int as val
			) x
		)
		else (
			select (pr_inkfront::text)::int
		)
		end as pr_inkfront,
		case
		when pr_jsonb ? 'pr_components'
		then (
			select sum(val) from ( 
				select (jsonb_each_text(pr_inkback)).value::int as val
			) x
		)
		else (
			select (pr_inkback::text)::int
		)
		end as pr_inkback,
		wo_qty,
		pr_process,
		wo_status
	from 
		wo wo,
		jsonb_to_record(wo_jsonb) as wo_jsonb (
			pr_id int,
			ma_id int,
			wo_status int,
			wo_qty numeric,
			wo_materialqty numeric,
			wo_componentmaterialqty jsonb
		), 
		product pr, 
		jsonb_to_record(pr_jsonb) as pr_jsonb (
			pr_inkfront jsonb,
			pr_inkback jsonb,
			pr_process text
		)
	where wo_jsonb.pr_id = pr.pr_id
	and wo_jsonb.wo_status in (3,4)
	and pr_jsonb.pr_process in ('offset', 'digital', 'flexo')
) x