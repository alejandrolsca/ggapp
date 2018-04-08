

UPDATE client 
SET cl_date = NOW();

UPDATE ink 
SET in_date = NOW();

UPDATE machine 
SET ma_date = NOW();

UPDATE material 
SET mt_date = NOW();

UPDATE materialtype 
SET maty_date = NOW();

UPDATE product 
SET pr_date = NOW();

UPDATE supplier 
SET su_date = NOW();

UPDATE wo 
SET wo_date = NOW();

UPDATE zone 
SET zo_date = NOW();

--select * from pg_timezone_names where utc_offset = '-06:00:00';
