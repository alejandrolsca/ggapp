select 
    ink.*,
    su.su_jsonb->>'su_name' as su_name
from  (
select 
    *
    from  public.ink, 
	jsonb_to_record(in_jsonb) as x (
		su_id int,
		in_code text,
		in_type text,
		in_description text,
		in_status text
	)
) ink
left join supplier su
on ink.su_id = su.su_id;