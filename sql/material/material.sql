select
    mt.*,
    maty.maty_jsonb->>'label' as maty_label,
    su.su_jsonb->>'su_name' as su_name
from (
    select 
    *
    from  public.material, 
    jsonb_to_record(mt_jsonb) as x (
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
