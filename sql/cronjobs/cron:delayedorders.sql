select
	wo.wo_id,
	wo.wo_commitmentdate::date,
	case
	when diff >= interval '2 day'
		then 'Normal'
	when diff > interval '0'
		then 'Por vencer'
	when diff <= interval '0'
		then 'Retrasado'
	end as delivery_status,
	abs(date_part('days',diff)) || 'd ' ||
	abs(date_part('hours',diff)) || 'h ' ||
	abs(date_part('minutes',diff)) || 'min' as delivery_time,
	case wo.wo_status
		when 0 then '(0) Activo'
		when 1 then '(1) En espera de material'
		when 2 then '(2) Material disponible'
		when 3 then '(3) En producción'
		when 4 then '(4) Detenido en Producción'
		when 5 then '(5) Acabados'
		when 6 then '(6) Detenido en Acabados'
		when 7 then '(7) Terminado'
		when 8 then '(8) Departamento de calidad'
		when 9 then '(9) Rechazado por calidad'
		when 10 then '(10) Aprobado por calidad'
		when 11 then '(11) Empaque e Inspección Final'
		when 12 then '(12) Producto terminado'
		when 13 then '(13) Facturación/Lista de Embarque'
		when 14 then '(14) Enviado'
		when 15 then '(15) No se pudo entregar'
		when 16 then '(16) Rechazado por el cliente'
	end as wo_textstatus,
	case
		when cljb.cl_type = 'natural' 
			then (cljb.cl_name || ' ' || cljb.cl_firstsurname || ' ' || coalesce(cljb.cl_secondsurname,''))
		else cljb.cl_corporatename
	end as cl_corporatename,
	zojb.zo_zone,
	prjb.pr_name,
	prjb.pr_code
from (
	select 
		wo_id,
		wojb.*,
		wo_date,
		wo_lastupdated,
		((wo_commitmentdate + interval '1 day') at time zone 'utc' at time zone 'america/chihuahua') - now() as diff
	from  wo, 
		jsonb_to_record(wo_jsonb) as wojb (
			cl_id int,
			zo_id int,
			pr_id int,
			wo_commitmentdate timestamptz,
			wo_status int
		)
) wo
left join client cl
on wo.cl_id = cl.cl_id
left join product pr
on wo.pr_id = pr.pr_id
left join zone zo
on wo.zo_id = zo.zo_id, 
jsonb_to_record(cl_jsonb) as cljb (
	cl_name text,
	cl_firstsurname text,
	cl_secondsurname text,
	cl_corporatename text,
	cl_type text
), jsonb_to_record(pr_jsonb) as prjb (
	pr_name text,
	pr_code text
), jsonb_to_record(zo_jsonb) as zojb (
	zo_zone text
)
where wo.wo_status in (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)
and diff <= interval '0'
order by wo.wo_commitmentdate asc
limit 1000;