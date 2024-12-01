import { createContext, useContext, useReducer, useEffect } from "react";
import questionsData from "../questions.json";

const QuizContext = createContext();

const intialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};
const SECS_OER_QUESTION = 15;

function reducer(state, action) {
  switch (action.type) {
    case "gotData":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "newAnswer":
      const qu = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === qu.correctOption
            ? state.points + qu.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "Finish":
      return {
        ...state,
        status: "Finish",
      };
    case "restart":
      return {
        ...intialState,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "Finish" : state.status,
      };
    case "dataFaild":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_OER_QUESTION,
      };
    default:
      throw new Error("Action unkonwn");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, intialState);
  //   useEffect(function () {
  //     fetch("http://localhost:8000/questions")
  //       .then((res) => res.json())
  //       .then((data) => dispatch({ type: "gotData", payload: data }))
  //       .catch((err) => dispatch({ type: "dataFaild" }));
  //   }, []);
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  useEffect(function () {
    dispatch({ type: "gotData", payload: questionsData.questions });
  }, []);
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        secondsRemaining,
        maxPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside of the QuizProvider");
  return context;
}
export { useQuiz, QuizProvider };
