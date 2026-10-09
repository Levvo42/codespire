export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true });
    }

    if (url.pathname === "/api/questions") {
      return getQuestions(url, env);
    }

    if (url.pathname === "/api/answer" && request.method === "POST") {
      return checkAnswer(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function getQuestions(url, env) {
  const tower = url.searchParams.get("tower");
  const difficulty = url.searchParams.get("difficulty");
  const count = Number(url.searchParams.get("count")) || 10;

  const { results: questions } = await env.codespire_db
    .prepare(
      "SELECT id, text FROM questions WHERE tower = ? AND difficulty = ? ORDER BY RANDOM() LIMIT ?",
    )
    .bind(tower, difficulty, count)
    .all();

  if (questions.length === 0) {
    return Response.json({ error: "no questions found" }, { status: 404 });
  }

  const { results: answers } = await env.codespire_db
    .prepare(
      "SELECT question_id, text FROM answers WHERE question_id IN (SELECT id FROM questions WHERE tower = ? AND difficulty = ?) ORDER BY position",
    )
    .bind(tower, difficulty)
    .all();

  return Response.json(
    questions.map((question) => ({
      id: question.id,
      text: question.text,
      answers: answers
        .filter((answer) => answer.question_id === question.id)
        .map((answer) => answer.text),
    })),
  );
}

async function checkAnswer(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { questionId, position } = body;

  const question = await env.codespire_db
    .prepare("SELECT explanation FROM questions WHERE id = ?")
    .bind(questionId)
    .first();

  if (!question) {
    return Response.json({ error: "question not found" }, { status: 404 });
  }

  const correctAnswer = await env.codespire_db
    .prepare(
      "SELECT position FROM answers WHERE question_id = ? AND is_correct = 1",
    )
    .bind(questionId)
    .first();

  return Response.json({
    correct: position === correctAnswer.position,
    correctPosition: correctAnswer.position,
    explanation: question.explanation,
  });
}
