CREATE TABLE account_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  to_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT account_transfers_different_accounts CHECK (from_account_id <> to_account_id)
);

CREATE INDEX idx_account_transfers_user_created ON account_transfers (user_id, created_at DESC);
CREATE INDEX idx_account_transfers_from ON account_transfers (from_account_id);
CREATE INDEX idx_account_transfers_to ON account_transfers (to_account_id);
