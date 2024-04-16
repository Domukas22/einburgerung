// import useState

import { useState, useRef, useEffect } from "react";
import "./reset.css";
import "./global.css";
import "./App.css";
import { questions } from "./questions";

export function App() {
  const [current, setCurrent] = useState(0);
  const [validated, setValidated] = useState([]);
  const [done, setDone] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState(
    shuffleArray(questions[current].answerOptions)
  );
  const inputRef = useRef(null);
  const [marked, SET_marked] = useState(JSON.parse(localStorage.getItem("marked")) || [1]);

  const navigate = (nr) => {
    setCurrent(nr);
    setValidated([]);
    setDone(false);
    setShuffledOptions(shuffleArray(questions[nr].answerOptions));
  };

  const handleKeyPress = (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") {
      if (current > 0) {
        navigate(current - 1);
      }
    } else if (e.key === "d" || e.key === "ArrowRight") {
      if (current < questions.length - 1) {
        navigate(current + 1);
      }
    }
  };

  const handleSubmit = (val) => {
    const newQuestionIndex = parseInt(val, 10) - 1;
    if (!isNaN(newQuestionIndex) && newQuestionIndex >= 0 && newQuestionIndex < questions.length) {
      navigate(newQuestionIndex);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = current + 1;
    }
  }, [current]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  function HANDLE_marked(action, nr) {
    console.log(action, nr);
    if (action === "remove") {
      const newMarked_LIST = marked.filter((item) => item !== nr);
      localStorage.setItem("marked", JSON.stringify(newMarked_LIST));
      SET_marked(newMarked_LIST);
    }
    if (action === "add") {
      if (marked.includes(nr)) return;
      const newMarked_LIST = [...marked, nr];
      localStorage.setItem("marked", JSON.stringify(newMarked_LIST));
      SET_marked(newMarked_LIST);
    }
  }

  // img_URL
  return (
    <div className="content">
      <div className="marked_WRAP">
        {marked
          .sort((a, b) => a - b)
          .map((nr, index) => (
            <div
              key={index}
              className="marked"
              data-active={nr === current}
              onClick={() => {
                navigate(nr);
              }}
            >
              {nr + 1}
            </div>
          ))}
      </div>
      <h1
        className="nr"
        data-marked={marked.includes(current)}
        onClick={() => {
          marked.includes(current)
            ? HANDLE_marked("remove", current)
            : HANDLE_marked("add", current);
        }}
      >
        {current + 1}
      </h1>
      <h4 className="question">{questions[current].questionText}</h4>
      {questions[current].img_URL !== undefined && (
        <div className="img_WRAP">
          <img src={questions[current].img_URL} alt="img" />
        </div>
      )}
      <div className="answers_WRAP">
        {shuffledOptions.map((answer, index) => (
          <div
            className="answer"
            key={index}
            onClick={() => {
              setValidated([...validated, index]);
              if (answer.correct) {
                setDone(true);
              }
            }}
            data-validated={validated.includes(index) || done}
            data-correct={answer.correct}
          >
            {answer.answer}
          </div>
        ))}
      </div>
      <div className="btn_WRAP">
        <div
          className="move_BTN arrow"
          onClick={() => {
            if (current > 0) {
              navigate(current - 1);
            }
          }}
        >
          ←
        </div>

        <input
          className="move_BTN"
          type="text"
          ref={inputRef}
          name="questionNumber"
          placeholder={`Question number`}
          onChange={(e) => handleSubmit(e.currentTarget.value)}
          onClick={(e) => e.currentTarget.select()}
          autoComplete="off"
        />

        <div
          className="move_BTN arrow"
          onClick={() => {
            if (current < questions.length - 1) {
              navigate(current + 1);
            }
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
