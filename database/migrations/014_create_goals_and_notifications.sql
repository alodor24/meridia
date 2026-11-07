CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
  description TEXT CHECK (description IS NULL OR char_length(description) <= 255),
  target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
  target_date DATE,
  icon TEXT,
  color TEXT NOT NULL DEFAULT '#2e7d32',
  status TEXT NOT NULL DEFAULT 'active',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT goals_status_chk CHECK (status IN ('active', 'completed')),
  CONSTRAINT goals_completed_chk CHECK (
    (status = 'completed' AND completed_at IS NOT NULL)
    OR (status = 'active' AND completed_at IS NULL)
  )
);

CREATE UNIQUE INDEX uq_goals_active_account ON goals (account_id) WHERE status = 'active';
CREATE INDEX idx_goals_user_status_created ON goals (user_id, status, created_at DESC);
CREATE INDEX idx_goals_account ON goals (account_id);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT notifications_type_chk CHECK (type IN ('goal_completed'))
);

CREATE INDEX idx_notifications_user_created ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id) WHERE read_at IS NULL;

CREATE TRIGGER trg_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
