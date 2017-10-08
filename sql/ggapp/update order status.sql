/*select * from wo
where wo_id = any(string_to_array('64,62,63',',')::integer[])*/

update wo
set wo_jsonb = jsonb_set(wo_jsonb,'{wo_status}','0')
where wo_id = any(string_to_array('64,63',',')::integer[])