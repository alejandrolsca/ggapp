select
	wo.wo_id,
	wo.cl_id,
	wo.zo_id,
	wo.wo_orderedby, 
	wo.ma_id, 
	wo.wo_release,
	wo.wo_po, 
	wo.pr_id, 
	wo.wo_qty,
	wo.wo_type,
	wo.wo_commitmentdate::date,
	wo.wo_previousid, 
	wo.wo_previousdate, 
	wo.wo_notes, 
	wo.wo_createdby, 
	wo.wo_updatedby, 
	to_char((wo.wo_lastupdated at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_lastupdated,  
	wo.wo_status,
	to_char((wo.wo_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as wo_date,
	case
	when diff >= interval '2 day'
		then 'Normal'
	when diff > interval '0'
		then 'Por vencer'
	when diff <= interval '0'
		then 'Retrasado'
	end as delivery_status,
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
		when 11 then '(11) Empaque'
		when 12 then '(12) Inspección Final'
		when 13 then '(13) Facturación/Lista de Embarque'
		when 14 then '(14) Enviado'
		when 15 then '(15) No se pudo entregar'
		when 16 then '(16) Rechazado por el cliente'
	end as wo_textstatus,
	abs(date_part('days',diff)) || 'd ' ||
	abs(date_part('hours',diff)) || 'h ' ||
	abs(date_part('minutes',diff)) || 'min' as delivery_time,
	ma.ma_jsonb->>'ma_name' ma_name,
	zo.zo_jsonb->>'zo_zone' zo_zone,
	case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl.cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
	cl.cl_jsonb->>'cl_name' as cl_name,
    cl.cl_jsonb->>'cl_firstsurname' as cl_firstsurname,
    cl.cl_jsonb->>'cl_secondsurname' as cl_secondsurname,
    cl.cl_jsonb->>'cl_type' as cl_type,
	pr.pr_jsonb->>'pr_name' as pr_name,
	pr.pr_jsonb->>'pr_code' as pr_code
from (
select 
    wo_id,
	wo_jsonb.*,
	wo_date,
	wo_lastupdated,
	((wo_commitmentdate + interval '1 day') at time zone 'utc' at time zone 'america/chihuahua') - now() as diff
from  wo, 
	jsonb_to_record(wo_jsonb) as wo_jsonb (
		cl_id int,
		zo_id int,
		wo_orderedby text,
		ma_id int, 
		wo_release text,
		wo_po text, 
		pr_id int,
		wo_qty int,
		wo_type text,
		wo_commitmentdate timestamptz,
		wo_previousid int, 
		wo_previousdate text, 
		wo_notes text, 
		wo_createdby text, 
		wo_updatedby text,
		wo_status int
	)
) wo
left join client cl
on wo.cl_id = cl.cl_id
left join product pr
on wo.pr_id = pr.pr_id
left join machine ma
on wo.ma_id = ma.ma_id
left join zone zo
on wo.zo_id = zo.zo_id
where wo.wo_status in (0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)
and cl.cl_id = $1
order by wo.wo_commitmentdate asc
limit 1000;