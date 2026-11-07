CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('suggestion', 'comment', 'use_case')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_user_created ON feedback (user_id, created_at DESC);
CREATE INDEX idx_feedback_created_at ON feedback (created_at DESC);
