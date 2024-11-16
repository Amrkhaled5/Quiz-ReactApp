import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishPage from "./FinishPage";
import Footer from "./Footer";
import Timer from "./Timer";
import questionsData from "./questions.json";
// import { type } from "@testing-library/user-event/dist/type";

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
function App() {
  const [state, dispatch] = useReducer(reducer, intialState);
  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "gotData", payload: data }))
  //     .catch((err) => dispatch({ type: "dataFaild" }));
  // }, []);
  useEffect(function () {
    dispatch({ type: "gotData", payload: questionsData.questions });
  }, []);
  const { questions, status, index, answer, points, secondsRemaining } = state;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numOfQuestions={questions.length} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={questions.length}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={questions.length}
              />
            </Footer>
          </>
        )}
        {status === "Finish" && (
          <FinishPage
            points={points}
            maxPoints={maxPoints}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
