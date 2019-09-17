select 
    ink.*,
    su.su_jsonb->>'su_name' as su_name
from  (
select 
    in_id,
    in_jsonb.*,
    to_char((in_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as in_date
    from  public.ink, 
	jsonb_to_record(in_jsonb) as in_jsonb (
		su_id int,
		in_code text,
		in_type text,
		in_description text,
		in_status text
	)
) ink
left join supplier su
on ink.su_id = su.su_id;