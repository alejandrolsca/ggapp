UPDATE public.zone
SET zo_jsonb = jsonb_set(zo_jsonb, '{_secondsurname}', zo_jsonb->'_motherslastname', true) - '_motherslastname'