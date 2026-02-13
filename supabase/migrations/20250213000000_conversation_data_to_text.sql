-- Migrate conversation_data from JSONB to TEXT to support encrypted values
ALTER TABLE journal_entries
  ALTER COLUMN conversation_data TYPE TEXT
  USING conversation_data::TEXT;
