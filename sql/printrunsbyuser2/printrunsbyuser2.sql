select
	printruns.wo_id,
	printruns.wo_qty,
	printruns.wo_price,
	(printruns.wo_qty * printruns.wo_price) as wo_total,
	printruns.ma_id,
	printruns.pr_name,
	printruns.pr_partno,
	printruns.pr_code,
	wohi.wo_updatedby,
	ma.ma_jsonb->>'ma_name' ma_name,
	(
		case 
		when components = false
		then (
			select ((coalesce(inkfront,0) + coalesce(inkback,0)) * coalesce(wo_materialqty,0))
		)
		else (
			select (
				(coalesce(inkfrontc1,0) + coalesce(inkbackc1,0) ) * coalesce(materialc1,0) +
				(coalesce(inkfrontc2,0) + coalesce(inkbackc2,0) ) * coalesce(materialc2,0) +
				(coalesce(inkfrontc3,0) + coalesce(inkbackc3,0) ) * coalesce(materialc3,0) +
				(coalesce(inkfrontc4,0) + coalesce(inkbackc4,0) ) * coalesce(materialc4,0) +
				(coalesce(inkfrontc5,0) + coalesce(inkbackc5,0) ) * coalesce(materialc5,0) +
				(coalesce(inkfrontc6,0) + coalesce(inkbackc6,0) ) * coalesce(materialc6,0) +
				(coalesce(inkfrontc7,0) + coalesce(inkbackc7,0) ) * coalesce(materialc7,0) +
				(coalesce(inkfrontc8,0) + coalesce(inkbackc8,0) ) * coalesce(materialc8,0) +
				(coalesce(inkfrontc9,0) + coalesce(inkbackc9,0) ) * coalesce(materialc9,0) 
			)
		)
		end 
	) print_runs,
	printruns.wo_status,
	printruns.wo_deliverydate
from (
	select
		wo_id,
		wo_jsonb.ma_id,
		ma_totalinks,
		case
		when pr_jsonb ? 'pr_components'
		then true
		else false
		end as components,
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
		pr_inkfront,
		pr_inkback,
		case
		when not pr_jsonb ? 'pr_components' and pr_process = 'flexo' and ((pr_inkfront)::text)::numeric = 0 
		then (
			select 1::numeric
		) 
		when not pr_jsonb ? 'pr_components' and pr_process = 'flexo'
		then (
			select ceil((((pr_inkfront)::text)::numeric / ma_totalinks))
		)
		when not pr_jsonb ? 'pr_components' and (pr_process = 'offset' or pr_process = 'digital' ) and pr_type = 'general'
		then (
			select ceil((((pr_inkfront)::text)::numeric / ma_totalinks))
		)
		end as inkfront,
		case
		when not pr_jsonb ? 'pr_components' and pr_process = 'flexo'
		then (
			select ceil((((pr_inkback)::text)::numeric / ma_totalinks))
		)
		when not pr_jsonb ? 'pr_components' and (pr_process = 'offset' or pr_process = 'digital' ) and pr_type = 'general'
		then (
			select ceil((((pr_inkback)::text)::numeric / ma_totalinks))
		)
		end as inkback,
		ceil((((pr_inkfront->>'0'))::numeric / ma_totalinks))  inkfrontc1,
		ceil((((pr_inkfront->>'1'))::numeric / ma_totalinks))  inkfrontc2,
		ceil((((pr_inkfront->>'2'))::numeric / ma_totalinks))  inkfrontc3,
		ceil((((pr_inkfront->>'3'))::numeric / ma_totalinks))  inkfrontc4,
		ceil((((pr_inkfront->>'4'))::numeric / ma_totalinks))  inkfrontc5,
		ceil((((pr_inkfront->>'5'))::numeric / ma_totalinks))  inkfrontc6,
		ceil((((pr_inkfront->>'6'))::numeric / ma_totalinks))  inkfrontc7,
		ceil((((pr_inkfront->>'7'))::numeric / ma_totalinks))  inkfrontc8,
		ceil((((pr_inkfront->>'8'))::numeric / ma_totalinks))  inkfrontc9,
		ceil((((pr_inkback->>'0'))::numeric / ma_totalinks))  inkbackc1,
		ceil((((pr_inkback->>'1'))::numeric / ma_totalinks))  inkbackc2,
		ceil((((pr_inkback->>'2'))::numeric / ma_totalinks))  inkbackc3,
		ceil((((pr_inkback->>'3'))::numeric / ma_totalinks))  inkbackc4,
		ceil((((pr_inkback->>'4'))::numeric / ma_totalinks))  inkbackc5,
		ceil((((pr_inkback->>'5'))::numeric / ma_totalinks))  inkbackc6,
		ceil((((pr_inkback->>'6'))::numeric / ma_totalinks))  inkbackc7,
		ceil((((pr_inkback->>'7'))::numeric / ma_totalinks))  inkbackc8,
		ceil((((pr_inkback->>'8'))::numeric / ma_totalinks))  inkbackc9,
		(wo_componentmaterialqty->>'0')::numeric materialc1,
		(wo_componentmaterialqty->>'1')::numeric materialc2,
		(wo_componentmaterialqty->>'2')::numeric materialc3,
		(wo_componentmaterialqty->>'3')::numeric materialc4,
		(wo_componentmaterialqty->>'4')::numeric materialc5,
		(wo_componentmaterialqty->>'5')::numeric materialc6,
		(wo_componentmaterialqty->>'6')::numeric materialc7,
		(wo_componentmaterialqty->>'7')::numeric materialc8,
		(wo_componentmaterialqty->>'8')::numeric materialc9,
		wo_qty,
		wo_price,
		pr_name,
		pr_partno,
		pr_code,
		pr_process,
		pr_type,
		wo_status,
		wo_jsonb.wo_deliverydate,
		wo_date
	from 
		wo wo,
		jsonb_to_record(wo_jsonb) as wo_jsonb (
			pr_id int,
			ma_id int,
			wo_status int,
			wo_qty numeric,
			wo_price numeric,
			wo_materialqty numeric,
			wo_componentmaterialqty jsonb,
			wo_deliverydate timestamptz
		), 
		product pr, 
		jsonb_to_record(pr_jsonb) as pr_jsonb (
			pr_name text,
			pr_partno text,
			pr_code text,
			pr_inkfront jsonb,
			pr_inkback jsonb,
			pr_process text,
			pr_type text
		),
		machine ma, jsonb_to_record(ma_jsonb) as ma_jsonb (
			ma_totalinks numeric
		)
	where wo_jsonb.pr_id = pr.pr_id
	and wo_jsonb.ma_id = ma.ma_id
	and pr_jsonb.pr_process in ('offset', 'digital', 'flexo')
	and pr_jsonb.pr_type not in ('ribbons')
) printruns
join machine ma
on printruns.ma_id = ma.ma_id
join (
	select 
		wohi.wo_id,
		njb.wo_updatedby
	from wohistory wohi, 
	jsonb_to_record(wohi_newjsonb) as njb (
		wo_status int,
		wo_updatedby text
	),
	jsonb_to_record(wohi_prevjsonb) as pjb (
		wo_status int,
		wo_updatedby text
	)
	where 
	pjb.wo_status = 3 and
	njb.wo_status in (5,7) and
	wohi.wohi_date between $1 and $2
) wohi
on printruns.wo_id = wohi.wo_id
order by wo_updatedby, wo_id desc