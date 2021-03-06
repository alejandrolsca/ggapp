SELECT *,
(
coalesce("0",0) + 
coalesce("1",0) +
coalesce("2",0) + 
coalesce("3",0) + 
coalesce("4",0) + 
coalesce("5",0) + 
coalesce("6",0) + 
coalesce("7",0) + 
coalesce("8",0) + 
coalesce("9",0) + 
coalesce("10",0) + 
coalesce("11",0) + 
coalesce("12",0) + 
coalesce("13",0) + 
coalesce("14",0) + 
coalesce("15",0) + 
coalesce("16",0) +
coalesce("17",0)    
) as total
FROM crosstab($$
	select
		pr.pr_jsonb->>'pr_process',
		wo_jsonb.cl_id,
		case
			when cl.cl_jsonb->>'cl_type' = 'natural' 
				then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
			else cl_jsonb->>'cl_corporatename'
		end as cl_corporatename,
		wo_jsonb.wo_status,
		sum(wo_qty * wo_jsonb.wo_price)
	from 
		wo wo, 
		jsonb_to_record(wo_jsonb) as wo_jsonb (
			cl_id int,
			pr_id int,
			wo_currency text,
			wo_price decimal,
			wo_qty int,
			wo_status int,
			wo_commitmentdate date
		)
		join client cl
		on wo_jsonb.cl_id = cl.cl_id
		join product pr
		on wo_jsonb.pr_id = pr.pr_id
		where wo_jsonb.wo_currency = '$$ || cast($1 as text) || $$'
		and wo_jsonb.wo_commitmentdate between '$$ || cast($2 as text) || $$' and '$$ || cast($3 as text) || $$'
		group by 2, 1, 3, 4
		order by 2, 1, 3, 4 DESC
$$,
$$
	select status from generate_series(0,18) status
$$)
as ct(
	pr_process text,
	cl_id int,
	cl_corporatename text,
	"0" decimal,
	"1" decimal,
	"2" decimal,
	"3" decimal,
	"4" decimal,
	"5" decimal,
	"6" decimal,
	"7" decimal,
	"8" decimal,
	"9" decimal,
	"10" decimal,
	"11" decimal,
	"12" decimal,
	"13" decimal,
	"14" decimal,
	"15" decimal,
	"16" decimal,
	"17" decimal,
	"18" decimal
)