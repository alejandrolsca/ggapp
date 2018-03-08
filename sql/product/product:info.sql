SELECT
	pr.pr_id,
	pr.key,
	pr.value,
	pr.value->'0' component1,
	pr.value->'1' component2,
	pr.value->'2' component3,
	pr.value->'3' component4,
	pr.value->'4' component5,
	pr.value->'5' component6,
	pr.value->'6' component7,
	pr.value->'7' component8,
	pr.value->'8' component9
FROM (
	SELECT
		pr_id,
		(jsonb_each(pr_jsonb)).*
	FROM product
	WHERE pr_id = $1
	AND pr_jsonb->>'pr_status' =  any(string_to_array($2,',')::text[])
	ORDER BY pr_id,(jsonb_each(pr_jsonb)).key ASC
) pr