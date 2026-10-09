-- Migration number: 0001 	 2026-10-09T10:44:31.657Z
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  tower TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  explanation TEXT
);

CREATE TABLE answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL REFERENCES questions(id),
  position INTEGER NOT NULL,
  text TEXT NOT NULL,
  is_correct INTEGER NOT NULL
);

CREATE INDEX idx_questions_tower_difficulty ON questions (tower, difficulty);