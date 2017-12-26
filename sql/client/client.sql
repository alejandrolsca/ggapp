select
	cl.cl_id,
	cl.cl_jsonb,
    x.cl_type,
    case
		when cl.cl_jsonb->>'cl_type' = 'natural' 
			then ((cl.cl_jsonb->>'cl_name') || ' ' || (cl.cl_jsonb->>'cl_firstsurname') || ' ' || coalesce(cl.cl_jsonb->>'cl_secondsurname',''))
		else cl_jsonb->>'cl_corporatename'
	end as cl_corporatename,
    x.cl_rfc,
    x.cl_name,
    x.cl_firstsurname,
    x.cl_secondsurname,
    x.cl_street,
    x.cl_streetnumber,
    x.cl_suitenumber,
    x.cl_neighborhood,
    x.cl_addressreference,
    (select name from countryinfo where geonameid = x.cl_country::int limit 1) as cl_country,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.cl_country::int and hi.childid = x.cl_state::int
        limit 1
    ) as cl_state,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.cl_state::int and hi.childid = x.cl_city::int
        limit 1
    ) as cl_city,
    (
		select
			gn.name
		from 
			hierarchy hi
		join geoname gn 
		on gn.geonameid = hi.childid
		where hi.parentid = x.cl_city::int and hi.childid = x.cl_county::int
        limit 1
    ) as cl_county,
    x.cl_zipcode,
    x.cl_email,
    x.cl_phone,
    x.cl_phoneextension,
    x.cl_mobile,
    x.cl_creditdays,
    x.cl_creditlimit,
    x.cl_customerdiscount,
    x.cl_receiptschedule,
    x.cl_status,
	cl.cl_date
from  public.client cl, 
jsonb_to_record(cl_jsonb) as x (
    cl_type text,
    cl_id int,
    cl_zone text,
    cl_corporatename text,
    cl_rfc text,
    cl_immex text,
    cl_name text,
    cl_firstsurname text,
    cl_secondsurname text,
    cl_street text,
    cl_streetnumber text,
    cl_suitenumber text,
    cl_neighborhood text,
    cl_addressreference text,
    cl_country text,
    cl_state text,
    cl_city text,
    cl_county text,
    cl_zipcode text,
    cl_email text,
    cl_phone text,
    cl_phoneextension text,
    cl_mobile text,
    cl_creditdays int,
    cl_creditlimit decimal,
    cl_customerdiscount decimal,
    cl_receiptschedule text,
    cl_status text
)
where cl.cl_jsonb->>'cl_status' = any(string_to_array($1,',')::text[])