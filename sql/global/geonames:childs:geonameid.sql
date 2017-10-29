SELECT
	gn.name "toponymName",
	hi.parentid AS parent,
	hi.childid AS "geonameId"
FROM
	HIERARCHY hi
JOIN geoname gn ON gn.geonameid = hi.childid
WHERE
	hi.parentid = $1
ORDER BY
	gn.name ASC