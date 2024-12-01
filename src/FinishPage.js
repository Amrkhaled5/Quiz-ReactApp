import { useQuiz } from "./contexts/QuizContext";

function FinishPage() {
  const { points, maxPoints, dispatch } = useQuiz();
  const percentage = (points / maxPoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🤔";
  if (percentage >= 0 && percentage < 50) emoji = "😏";
  if (percentage === 0) emoji = "🤦‍♂️";
  return (
    <div className="start">
      <p className="result">
        <span>{emoji}</span>
        You Scored <strong>{points}</strong>
        out of {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restart" });
        }}
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default FinishPage;
