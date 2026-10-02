// Questions for the battle.
// For now they come from our own JSON file. When our question API is ready,
// only this file changes (fetch + throw on errors, like api/monsters.js).
import htmlQuestions from "../data/html.json";
import { shuffle } from "../utils/shuffle.js";

/**
 * Picks questions of one difficulty in random order.
 *
 * @param {string} difficulty - "EASY", "MEDIUM", "HARD" or "EXTREME".
 * @param {number} count - How many to pick (e.g. 33 out of 50).
 * @returns {Promise<object[]>} Questions: { question, answers, correctAnswer, explanation }
 */
export async function getQuestions(difficulty, count) {
  const pool = htmlQuestions.questions.filter(
    (question) => question.difficulty === difficulty,
  );

  return shuffle(pool).slice(0, count).map(toQuestion);
}

// Our JSON → the shape the battle screen uses.
// answers is 4 texts (multiple choice) or 2 (true/false).
function toQuestion(question) {
  return {
    question: question.text,
    answers: question.answers.map((answer) => answer.text),
    correctAnswer: question.answers.findIndex((answer) => answer["is-correct"]),
    explanation: question.explanation,
  };
}
