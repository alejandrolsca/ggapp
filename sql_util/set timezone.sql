set timezone = 'America/Chihuahua';
select to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS.MSOF');

set timezone = 'America/Mexico_City';
select to_char(now(),'YYYY-MM-DD"T"HH24:MI:SS.MSOF')