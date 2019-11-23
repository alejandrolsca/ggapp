select
	wo_id,
	Y.mt_id,
	mt_jsonb.mt_type,
	maty_jsonb.label maty_label,
	mt_jsonb.mt_code,
	mt_jsonb.mt_description,
	wo_materialqty,
	case wo_status
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
		when 17 then '(17) Entregada'
		when 18 then '(18) Cancelada'
	end as wo_status,
	count(*) over (partition by Y.mt_id) mt_count
from 
(
	select
		wo_id,
		(jsonb_each(mt_id)).value mt_id,
		((jsonb_each_text(materialqty)).value)::decimal wo_materialqty,
		wo_status
	from
	(
		select
			wo_id,
			cl_id,
			case
				when jsonb_typeof(mt_id) = 'object'
				then mt_id
				else jsonb_build_object('0',mt_id)
			end as mt_id,
			case
				when jsonb_typeof(mt_id) = 'object'
				then wo_componentmaterialqty
				else jsonb_build_object('0',wo_materialqty)
			end as materialqty,
			wo_status
		from wo, jsonb_to_record(wo_jsonb) wo_jsonb (
			cl_id integer,
			pr_id integer,
			wo_materialqty jsonb,
			wo_componentmaterialqty jsonb,
			wo_status integer
		)
		join (
			select
				pr_id,
				pr_jsonb.*
			from product pr, jsonb_to_record(pr.pr_jsonb) pr_jsonb (
			mt_id jsonb
			)
		) pr
		on wo_jsonb.pr_id = pr.pr_id
		where wo_date between $1 and $2
		and exists (
				select
					wo_id
				from wohistory, jsonb_to_record(wohi_newjsonb) as wohi_newjsonb (
					wo_status integer
				)
				where wo_status = 3
				and wo_id = wo.wo_id
				limit 1
		)
	) X
) Y
join material mt
on Y.mt_id = mt.mt_id::text::jsonb, jsonb_to_record(mt_jsonb) as mt_jsonb (
	mt_code text,
	mt_description text,
	mt_type integer
)
join materialtype maty
on mt_jsonb.mt_type = maty.maty_id, jsonb_to_record(maty_jsonb) as maty_jsonb (
	label text
)
order by mt_count desc
