import { readFileSync, writeFileSync } from "node:fs";

const TOWERS = ["html", "css", "javascript"];

// Wraps text in quotes for SQL. A ' inside the text must be written as ''
function sqlText(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

// Empty the tables first, so the script can be run again without errors
const lines = ["DELETE FROM answers;", "DELETE FROM questions;"];

for (const tower of TOWERS) {
  const data = JSON.parse(readFileSync(`src/js/data/${tower}.json`, "utf8"));

  for (const question of data.questions) {
    lines.push(
      `INSERT INTO questions (id, tower, difficulty, type, text, explanation) VALUES (${sqlText(question.id)}, ${sqlText(tower)}, ${sqlText(question.difficulty)}, ${sqlText(question.type)}, ${sqlText(question.text)}, ${sqlText(question.explanation)});`,
    );

    question.answers.forEach((answer, position) => {
      lines.push(
        `INSERT INTO answers (question_id, position, text, is_correct) VALUES (${sqlText(question.id)}, ${position}, ${sqlText(answer.text)}, ${answer["is-correct"] ? 1 : 0});`,
      );
    });
  }
}

writeFileSync("seed.sql", lines.join("\n"));
