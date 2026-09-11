SELECT
    m.motion_id,
    mt.meeting_date,
    m.plain_english_summary,
    m.result,
    m.financial_impact_amount,
    m.financial_impact_status,
    m.significance_reason,
    SUM(CASE WHEN v.vote_value='yes' THEN 1 ELSE 0 END) AS yes_votes,
    SUM(CASE WHEN v.vote_value='no' THEN 1 ELSE 0 END) AS no_votes
FROM dim_motion m
JOIN dim_meeting mt USING (meeting_id)
LEFT JOIN fact_council_vote v USING (motion_id)
WHERE m.significance_flag = TRUE
GROUP BY ALL
ORDER BY mt.meeting_date DESC;
