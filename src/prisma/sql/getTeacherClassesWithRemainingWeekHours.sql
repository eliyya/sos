-- @param {BigInt} $1:timestamp in epoch milliseconds
-- @param {String} $2:user id
WITH limites AS (
    SELECT 
        date_trunc('day',
            to_timestamp($1 / 1000) AT TIME ZONE 'America/Monterrey'
            - INTERVAL '1 day' * EXTRACT(DOW FROM to_timestamp($1 / 1000) AT TIME ZONE 'America/Monterrey')::int
        ) AT TIME ZONE 'America/Monterrey' AS semana_inicio,
        date_trunc('day',
            to_timestamp($1 / 1000) AT TIME ZONE 'America/Monterrey'
            - INTERVAL '1 day' * EXTRACT(DOW FROM to_timestamp($1 / 1000) AT TIME ZONE 'America/Monterrey')::int
        ) AT TIME ZONE 'America/Monterrey' + INTERVAL '6 days 23:59:59.999' AS semana_fin
)
SELECT
    c.id,
    c.subject_id,
    c.teacher_id,
    c.career_id,
    c."group",
    c.semester,
    c.status,
    c.created_at,
    c.updated_at,
    s.practice_hours
    - COALESCE((
        SELECT SUM(EXTRACT(EPOCH FROM (p.ends_at - p.starts_at)) / 3600)
        FROM practices p
        WHERE p.class_id = c.id
          AND p.starts_at >= l.semana_inicio
          AND p.starts_at <= l.semana_fin
    ), 0)::int AS left_hours,
    to_jsonb(s) AS subject,
    to_jsonb(cr) AS career,
    to_jsonb(t) AS teacher
FROM classes c
JOIN subjects s ON c.subject_id = s.id
LEFT JOIN careers cr ON c.career_id = cr.id
LEFT JOIN users t ON c.teacher_id = t.id
JOIN limites l ON TRUE
WHERE c.teacher_id = $2;