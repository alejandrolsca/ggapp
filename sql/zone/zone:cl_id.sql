select
	zo.zo_id,
	zo.zo_jsonb,
    x.zo_type,
    x.cl_id,
    x.zo_zone,
    x.zo_corporatename,
    x.zo_rfc,
    x.zo_immex,
    x.zo_name,
    x.zo_firstsurname,
    x.zo_secondsurname,
    x.zo_street,
    x.zo_streetnumber,
    x.zo_suitenumber,
    x.zo_neighborhood,
    x.zo_addressreference,
    (select name from countryinfo where geonameid = x.zo_country::int) as zo_country,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.zo_country::int and hi.childid = x.zo_state::int
    ) as zo_state,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.zo_state::int and hi.childid = x.zo_city::int
    ) as zo_city,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.zo_city::int and hi.childid = x.zo_county::int
    ) as zo_county,
    x.zo_zipcode,
    x.zo_email,
    x.zo_phone,
    x.zo_phoneextension,
    x.zo_mobile,
    x.zo_status,
	zo.zo_date
from  public.zone zo, 
jsonb_to_record(zo_jsonb) as x (
    zo_type text,
    cl_id int,
    zo_zone text,
    zo_corporatename text,
    zo_rfc text,
    zo_immex text,
    zo_name text,
    zo_firstsurname text,
    zo_secondsurname text,
    zo_street text,
    zo_streetnumber text,
    zo_suitenumber text,
    zo_neighborhood text,
    zo_addressreference text,
    zo_country text,
    zo_state text,
    zo_city text,
    zo_county text,
    zo_zipcode text,
    zo_email text,
    zo_phone text,
    zo_phoneextension text,
    zo_mobile text,
    zo_status text
)
where zo.zo_jsonb->>'cl_id' = $1
and zo.zo_jsonb->>'zo_status' = any(string_to_array($2,',')::text[])