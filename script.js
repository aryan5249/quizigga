const questionBox = document.querySelector("#question-text");
const answerButtons = document.querySelectorAll(".answer-btn");
const counterDisplay = document.querySelector("#current-q");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

async function getQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    questions = data.results;
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
    



  } catch (error) {
    console.error("Error fetching question:", error);
  }


}


function displayQuestion() {
  const questionData = questions[currentQuestionIndex];

  questionBox.textContent = decodeHTML(questionData.question);
  counterDisplay.textContent = currentQuestionIndex + 1;

  const answers = [questionData.correct_answer, ...questionData.incorrect_answers];
  answers.sort(() => Math.random() - 0.5);
  answerButtons.forEach((button, index) => {
    const optionText = button.querySelector(".option-text");
    optionText.textContent = decodeHTML(answers[index]);

    button.disabled = false;
    button.classList.remove("correct");
    button.classList.remove("wrong");

  });
}

function handleAnswerClick(button) {
  const questionData = questions[currentQuestionIndex];
  const correctAnswer = decodeHTML(questionData.correct_answer);
  const selectedAnswer = button.querySelector(".option-text").textContent;

  
  answerButtons.forEach((btn) => (btn.disabled = true));

  if (selectedAnswer === correctAnswer) {
    score++;
    button.classList.add("correct");
  } else {
    button.classList.add("wrong");
    

    answerButtons.forEach((btn) => {
      if (btn.querySelector(".option-text").textContent === correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {

      displayQuestion();
    } else {
      questionBox.textContent = `Quiz finished! You scored ${score} / ${questions.length}`;
      answerButtons.forEach((btn) => {
        btn.style.display = "none";
      });
    }
  }, 1500); 
}

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleAnswerClick(button);
  });
});

getQuestions();








