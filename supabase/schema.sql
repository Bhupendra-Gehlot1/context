CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  asked_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on messages"
  ON messages FOR SELECT USING (true);

CREATE POLICY "Allow public insert on messages"
  ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on users"
  ON users FOR SELECT USING (true);

CREATE POLICY "Allow public insert on users"
  ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on users"
  ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read on questions"
  ON questions FOR SELECT USING (true);

CREATE POLICY "Allow public insert on questions"
  ON questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on questions"
  ON questions FOR UPDATE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE questions;
