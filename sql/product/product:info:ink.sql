SELECT 
	array_to_string(array_agg(ink.in_code),',') as inks
FROM (
	SELECT in_jsonb->>'in_code' as in_code
	FROM   ink 
	JOIN   unnest(string_to_array($1,',')::int[]) WITH ORDINALITY t(in_id, ord) USING (in_id)
	WHERE in_jsonb->>'in_status' = $2
	ORDER  BY t.ord
) ink