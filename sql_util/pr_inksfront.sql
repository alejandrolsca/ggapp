select
pr_id,
component,
--array_to_string(array_agg(in_id),', ') in_id
(
	SELECT 
	array_to_string(array_agg(ink.in_code),', ') as inks
	FROM (
		SELECT in_jsonb->>'in_code' as in_code
		FROM   ink 
		JOIN   unnest(string_to_array(array_to_string(array_agg(ink_id),','),',')::int[]) WITH ORDINALITY t(in_id, ord) USING (in_id)
		WHERE in_jsonb->>'in_status' = any(string_to_array('A,I',',')::text[])
		ORDER  BY t.ord
	) ink
)
from (
	select
		pr_id,
		(jsonb_each(pr_jsonb->'pr_inksfront')).key component,
		(jsonb_each(pr_jsonb->'pr_inksfront')).value
	from product
	where pr_id = 4
) inks
CROSS JOIN LATERAL (
	select (
		case
			when jsonb_typeof(value) = 'object'
			then (select (jsonb_each(value)).value)
			else (select value)
		end
	) as ink_id
) inks_front
GROUP BY pr_id, component
order by 1,2;

select * from crosstab(
'select
pr_id,
component,
(
	SELECT 
	array_to_string(array_agg(ink.in_code),'', '') as inks
	FROM (
		SELECT in_jsonb->>''in_code'' as in_code
		FROM   ink 
		JOIN   unnest(string_to_array(array_to_string(array_agg(ink_id),'',''),'','')::int[]) WITH ORDINALITY t(in_id, ord) USING (in_id)
		WHERE in_jsonb->>''in_status'' = any(string_to_array(''A,I'','','')::text[])
		ORDER  BY t.ord
	) ink
)
from (
	select
		pr_id,
		(jsonb_each(pr_jsonb->''pr_inksfront'')).key component,
		(jsonb_each(pr_jsonb->''pr_inksfront'')).value
	from product
	where pr_id = 4
) inks
CROSS JOIN LATERAL (select (jsonb_each(value)).value as ink_id) inks_front
GROUP BY pr_id, component
order by 1,2')
AS ct (
	pr_id int, 
	c1_frontinks text, 
	c2_frontinks text,
	c3_frontinks text, 
	c4_frontinks text,
	c5_frontinks text, 
	c6_frontinks text,
	c7_frontinks text, 
	c8_frontinks text,
	c9_frontinks text
);

