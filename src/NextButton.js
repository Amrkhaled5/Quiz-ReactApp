import { useQuiz } from "./contexts/QuizContext";

function NextButton() {
  const { index, questions, dispatch, answer } = useQuiz();
  const numQuestions = questions.length;
  if (answer === null) return null;
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "nextQuestion" });
        }}
      >
        Next
      </button>
    );
  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "Finish" });
        }}
      >
        Finish
      </button>
    );
}

export default NextButton;
