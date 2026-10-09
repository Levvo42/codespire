// Questions for the battle, from our own API (server/index.js).
// The browser never gets the correct answers: /api/answer checks them.

/**
 * Picks questions for one tower and difficulty in random order.
 *
 * @param {string} tower - A tower id from TOWERS, e.g. "html".
 * @param {string} difficulty - "EASY", "MEDIUM", "HARD" or "EXTREME".
 * @param {number} count - How many to pick.
 * @returns {Promise<object[]>} Questions: { id, question, answers }
 * @throws {Error} If the request fails.
 */
export async function getQuestions(tower, difficulty, count) {
  const response = await fetch(
    `/api/questions?tower=${tower}&difficulty=${difficulty}&count=${count}`,
  );

  if (!response.ok) {
    throw new Error(`the question server answered ${response.status}`);
  }

  const questions = await response.json();

  return questions.map((question) => ({
    id: question.id,
    question: question.text,
    answers: question.answers,
  }));
}

/**
 * Asks the server if an answer is correct.
 *
 * @param {string} questionId - The question's id, e.g. "html-easy-001".
 * @param {number} position - Index of the chosen answer.
 * @returns {Promise<object>} { isCorrect, correctAnswer, explanation }
 * @throws {Error} If the request fails.
 */
export async function checkAnswer(questionId, position) {
  const response = await fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, position }),
  });

  if (!response.ok) {
    throw new Error(`the answer server answered ${response.status}`);
  }

  const result = await response.json();

  return {
    isCorrect: result.correct,
    correctAnswer: result.correctPosition,
    explanation: result.explanation,
  };
}
