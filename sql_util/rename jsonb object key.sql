update public.zone
SET zo_jsonb = REPLACE(zo_jsonb::TEXT,'_motherslastname','_secondsurname')::JSON
returning *;
