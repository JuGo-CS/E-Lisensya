CREATE EVENT auto_breach_expired_permits
ON SCHEDULE EVERY 1 MINUTE
STARTS CURRENT_TIMESTAMP
DO
    UPDATE permit
    SET status = 'BREACHED'
    WHERE status = 'ACTIVE'
    AND (
        -- If late permit, it will expires at 11:00pm of the same day. Meaning the status will automatically be updated to BREACHED:>
        (permit_name = 'Late' AND NOW() > CONCAT(date_created, ' 23:00:00'))
        OR
        -- On overnight, same logic but with extended curfew of next day 11:00pm
        (permit_name = 'Overnight' AND NOW() > CONCAT(DATE_ADD(date_created, INTERVAL 1 DAY), ' 23:00:00'))
    );
