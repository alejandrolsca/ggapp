insert into shippinglist
(sl_jsonb) values ((
    jsonb_build_object('cl_id', $1::int) || jsonb_build_object('zo_id', $2::int) || jsonb_build_object('wo_id', $3::text) || jsonb_build_object('sl_createdby', $4::text)
))
returning sl_id, sl_date;