select
    wo.wo_id,
	wjb.wo_po,
	wjb.wo_release,
	prjb.pr_partno,
	zjb.zo_zone as shipto_name,
    (
		zjb.zo_neighborhood || 
		' No. Ext. ' || coalesce(zjb.zo_streetnumber,'S/N') || 
		' No. Int. ' || coalesce(zjb.zo_suitenumber,'S/N') || ' ' || 
		coalesce(zjb.zo_street,'') || ' C.P. ' || 
		coalesce(zjb.zo_zipcode,'N/A')
	) as shipto_address,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = zjb.zo_state and hi.childid = zjb.zo_city
        limit 1
    ) as shipto_city,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = zjb.zo_country and hi.childid = zjb.zo_state
        limit 1
    ) as shipto_state,
	zjb.zo_zipcode as shipto_zip,
	wjb.wo_qty,
	prjb.pr_weight,
	wjb.wo_price,
	((wjb.wo_qty * prjb.pr_weight)/0.453592) as total_weight,
    (wjb.wo_qty * wjb.wo_price) as total_price
from  wo wo
join product pr
on wo.wo_jsonb->>'pr_id' = pr.pr_id::text
join zone zo
on zo.zo_id = $3,
jsonb_to_record(wo_jsonb) as wjb (
	cl_id int,
    wo_qty int,
	wo_partno text,
	wo_po text,
	wo_release text,
	wo_status int,
	wo_price decimal
),
jsonb_to_record(pr_jsonb) as prjb (
		pr_name text,
		pr_partno text,
        pr_weight decimal
)
,
jsonb_to_record(zo_jsonb) as zjb (
		zo_zone text,
		zo_neighborhood text,
        zo_street text,
		zo_streetnumber text,
        zo_suitenumber text,
		zo_zipcode text,
		zo_city int,
		zo_state int,
		zo_country int
)
where wjb.cl_id = $1
and wo_id = any(string_to_array($2,',')::integer[])
order by 1 asc