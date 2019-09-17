select
    mt.*,
    maty.maty_jsonb->>'label' as maty_label,
    case
		when su.su_jsonb->>'su_type' = 'natural' 
			then ((su.su_jsonb->>'su_name') || ' ' || (su.su_jsonb->>'su_firstsurname') || ' ' || coalesce(su.su_jsonb->>'su_secondsurname',''))
		else su_jsonb->>'su_corporatename'
	end as su_corporatename
from (
    select 
    mt_id,
    mt_jsonb.*,
    to_char((mt_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as mt_date
    from  public.material, 
    jsonb_to_record(mt_jsonb) as mt_jsonb (
        su_id int,
        mt_code text,
        mt_type int,
        mt_description text,
        mt_weight text,
        mt_width text,
        mt_measure text,
        mt_height text,
        mt_thickness decimal,
        mt_thicknessmeasure text,
        mt_status text
    )
) mt
left join materialtype maty
on mt.mt_type = maty.maty_id
left join supplier su
on mt.su_id = su.su_id
