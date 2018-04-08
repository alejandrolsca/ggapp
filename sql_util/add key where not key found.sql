update public.supplier
set su_jsonb = jsonb_set(su_jsonb,'{su_type}', jsonb '"legal"')
where not su_jsonb ? 'su_type'

