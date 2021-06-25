select
	wo_id,
	case
		when pr_stapling in ('1','2','manual')
		then wo_qty
		else 0
	end pr_staplingqty,
	case
		when pr_bound = 'yes'
		then wo_qty
		else 0
	end pr_boundqty,
	case
		when jsonb_typeof(pr_foldunit1) = 'object'
		then 
			case when (
				coalesce((pr_foldunit1->>'0')::int,0) + 
				coalesce((pr_foldunit1->>'1')::int,0) + 
				coalesce((pr_foldunit1->>'2')::int,0) + 
				coalesce((pr_foldunit1->>'3')::int,0) +
				coalesce((pr_foldunit1->>'4')::int,0) + 
				coalesce((pr_foldunit1->>'5')::int,0) + 
				coalesce((pr_foldunit1->>'6')::int,0) + 
				coalesce((pr_foldunit1->>'7')::int,0) +
				coalesce((pr_foldunit1->>'8')::int,0)
			) > 0 then wo_qty else 0 end
		else case when coalesce(pr_foldunit1::text::int,0) > 0 then wo_qty else 0 end
	end pr_foldunit1qty/*,
	wo_jsonb.*,
	pr_jsonb.*,
	ma_jsonb.**/
from 
	wo wo,
	jsonb_to_record(wo_jsonb) as wo_jsonb (
		pr_id int,
		ma_id int,
		wo_qty numeric,
		wo_commitmentdate date,
		wo_status int
	), 
	product pr, 
	jsonb_to_record(pr_jsonb) as pr_jsonb (
		pr_process text,
		pr_type text,
		pr_stapling text,
    pr_bound text,
		pr_foldunit1 jsonb,
    pr_foldunit2 jsonb,
    pr_foldunit3 jsonb,
    pr_foldunit4 jsonb
		
	),
	machine ma, jsonb_to_record(ma_jsonb) as ma_jsonb (
		ma_name text
	)
where wo_jsonb.pr_id = pr.pr_id
and wo_jsonb.ma_id = ma.ma_id
and wo_jsonb.wo_status not in (18)
and pr_jsonb.pr_process in ('offset', 'digital')
and pr_jsonb.pr_type in ('general','paginated')
and wo_jsonb.wo_commitmentdate between $1 and $2
