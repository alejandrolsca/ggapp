select 
    ma_id,
    ma_jsonb.*,
    to_char((ma_date at time zone 'america/chihuahua'),'YYYY-MM-DD HH24:MI:SS') as ma_date
from  public.machine, 
jsonb_to_record(ma_jsonb) as ma_jsonb (
    ma_name text,
    ma_maxsizewidth text,
    ma_maxsizeheight text,
    ma_minsizewidth text,
    ma_minsizeheight text,
    ma_sizemeasure text,
    ma_totalinks text,
    ma_fullcolor text,
    ma_printbg text,
    ma_process text,
    ma_status text
);