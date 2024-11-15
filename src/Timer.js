import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;
  useEffect(
    function () {
      const ti = setInterval(() => dispatch({ type: "tick" }), 1000);
      return () => clearInterval(ti);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}: {sec < 10 && "0"}
      {sec}
    </div>
  );
}

export default Timer;
