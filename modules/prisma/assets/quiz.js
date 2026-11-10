// Multiple-choice quiz with immediate feedback.
// Markup:
// <div class="quiz" data-answer="2">            (1-based index of the correct option)
//   <p class="q">Question?</p>
//   <ol><li>Option A</li><li>Option B</li>...</ol>
//   <div class="explain">Why the answer is what it is.</div>
// </div>
// Optional: <span class="quiz-score"></span> anywhere on the page shows the running score.
(function () {
  const quizzes = Array.from(document.querySelectorAll(".quiz"));
  let answered = 0, correct = 0;

  function updateScore() {
    document.querySelectorAll(".quiz-score").forEach((el) => {
      el.textContent = answered === quizzes.length
        ? `Você acertou ${correct} de ${quizzes.length}.`
        : `${answered} de ${quizzes.length} respondidas.`;
    });
  }

  quizzes.forEach((quiz) => {
    const answer = Number(quiz.dataset.answer);
    const explain = quiz.querySelector(".explain");
    if (explain) explain.hidden = true;

    const items = Array.from(quiz.querySelectorAll("ol > li"));
    const buttons = items.map((li) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "opt";
      btn.innerHTML = li.innerHTML;
      li.replaceChildren(btn);
      return btn;
    });

    buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        const isRight = i + 1 === answer;
        buttons.forEach((b) => (b.disabled = true));
        buttons[answer - 1].classList.add("correct");
        if (!isRight) btn.classList.add("wrong");
        answered++; if (isRight) correct++;
        if (explain) {
          const v = document.createElement("span");
          v.className = "verdict";
          v.textContent = isRight ? "Correto. " : "Não exatamente. ";
          explain.prepend(v);
          explain.hidden = false;
        }
        updateScore();
      });
    });
  });
  updateScore();
})();
