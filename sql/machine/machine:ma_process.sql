select 
    *
from  public.machine, 
jsonb_to_record(ma_jsonb) as x (
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
)
where ma_jsonb->>'ma_process' = $1
and ma_jsonb->>'ma_status' = $2;