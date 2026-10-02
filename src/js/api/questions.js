// Questions for the battle.
// For now they come from our own JSON files (src/js/data/{tower}.json).
// When our question API is ready, only this file changes.
import { shuffle } from "../utils/shuffle.js";

/**
 * Picks questions for one tower and difficulty in random order.
 *
 * @param {string} tower - A tower id from TOWERS, e.g. "html".
 * @param {string} difficulty - "EASY", "MEDIUM" or "HARD".
 * @param {number} count - How many to pick (e.g. 33 out of 50).
 * @returns {Promise<object[]>} Questions: { question, answers, correctAnswer, explanation }
 * @throws {Error} If the tower has no questions file or no questions of that difficulty.
 */
export async function getQuestions(tower, difficulty, count) {
  const { questions } = await import(`../data/${tower}.json`);
  const pool = questions.filter(
    (question) => question.difficulty === difficulty,
  );

  if (pool.length === 0) {
    throw new Error(`no ${difficulty} questions for the ${tower} tower`);
  }

  return shuffle(pool).slice(0, count).map(toQuestion);
}

// Our JSON → the shape the battle screen uses.
// answers is 4 texts (multiple choice) or 2 (true/false).
function toQuestion(question) {
  const correctAnswer = question.answers.findIndex(
    (answer) => answer["is-correct"],
  );

  // A question without a correct answer would mark every answer wrong
  if (correctAnswer === -1) {
    throw new Error(`question ${question.id} has no correct answer`);
  }

  return {
    question: question.text,
    answers: question.answers.map((answer) => answer.text),
    correctAnswer,
    explanation: question.explanation,
  };
}
