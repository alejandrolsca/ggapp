select
    mt.*,
    maty.maty_jsonb->>'label' as maty_label
from (
    select 
    *
    from  public.material, 
    jsonb_to_record(mt_jsonb) as x (
        su_id int,
        mt_code text,
        mt_type text,
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
on mt.mt_type = maty.maty_id::text
