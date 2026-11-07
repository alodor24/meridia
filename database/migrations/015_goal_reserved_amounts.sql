DROP INDEX IF EXISTS uq_goals_active_account;

ALTER TABLE goals
  ADD COLUMN saved_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;

UPDATE goals g
SET saved_amount = CASE
  WHEN g.status = 'completed' THEN g.target_amount
  ELSE LEAST(
    g.target_amount,
    GREATEST(COALESCE(b.balance, 0), 0)
  )
END
FROM (
  SELECT
    a.id,
    COALESCE((
      SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)::numeric
      FROM transactions t
      WHERE t.account_id = a.id
    ), 0)
    + COALESCE((
      SELECT SUM(tr.amount)::numeric
      FROM account_transfers tr
      WHERE tr.to_account_id = a.id
    ), 0)
    - COALESCE((
      SELECT SUM(tr.amount)::numeric
      FROM account_transfers tr
      WHERE tr.from_account_id = a.id
    ), 0) AS balance
  FROM accounts a
) b
WHERE b.id = g.account_id;

ALTER TABLE goals
  ADD CONSTRAINT goals_saved_amount_chk CHECK (
    saved_amount >= 0 AND saved_amount <= target_amount
  );

WITH completed AS (
  UPDATE goals
  SET status = 'completed', completed_at = now()
  WHERE status = 'active' AND saved_amount >= target_amount
  RETURNING id, user_id, account_id, name
)
INSERT INTO notifications (user_id, type, goal_id, title, message)
SELECT
  c.user_id,
  'goal_completed',
  c.id,
  '¡Meta completada!',
  'Alcanzaste tu meta "' || c.name || '" en la cuenta "' || a.name || '".'
FROM completed c
JOIN accounts a ON a.id = c.account_id;

CREATE INDEX idx_goals_active_account ON goals (account_id) WHERE status = 'active';
