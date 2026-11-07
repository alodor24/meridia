CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
  start_date DATE NOT NULL,
  recurrence_unit TEXT,
  recurrence_interval INTEGER,
  recurrence_end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reminders_recurrence_unit_chk CHECK (
    recurrence_unit IS NULL OR recurrence_unit IN ('day', 'week', 'month', 'year')
  ),
  CONSTRAINT reminders_recurrence_chk CHECK (
    (recurrence_unit IS NULL AND recurrence_interval IS NULL AND recurrence_end_date IS NULL)
    OR (
      recurrence_unit IS NOT NULL
      AND recurrence_interval IS NOT NULL
      AND recurrence_interval BETWEEN 1 AND 999
    )
  ),
  CONSTRAINT reminders_end_date_chk CHECK (
    recurrence_end_date IS NULL OR recurrence_end_date >= start_date
  )
);

CREATE INDEX idx_reminders_user_start ON reminders (user_id, start_date);

CREATE TABLE reminder_occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  occurrence_date DATE NOT NULL,
  scheduled_date DATE,
  title TEXT CHECK (title IS NULL OR char_length(btrim(title)) BETWEEN 1 AND 120),
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reminder_occurrences_unique UNIQUE (reminder_id, occurrence_date),
  CONSTRAINT reminder_occurrences_status_chk CHECK (status IN ('pending', 'paid', 'cancelled')),
  CONSTRAINT reminder_occurrences_paid_chk CHECK (
    (status = 'paid' AND paid_at IS NOT NULL)
    OR (status <> 'paid' AND paid_at IS NULL)
  )
);

CREATE INDEX idx_reminder_occurrences_scheduled ON reminder_occurrences (reminder_id, scheduled_date);

CREATE TRIGGER trg_reminders_updated_at BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reminder_occurrences_updated_at BEFORE UPDATE ON reminder_occurrences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
