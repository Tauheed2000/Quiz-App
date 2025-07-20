import React, { useState, useEffect } from "react";
import questions from "./data/questions";
import Question from "./components/Question";
import "./App.css";

const QUIZ_LENGTH = 5;

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);

  const [askedQuestions, setAskedQuestions] = useState([]);

  // quiz state
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answerLocked, setAnswerLocked] = useState(false); // block re-clicks
  const [quizCompleted, setQuizCompleted] = useState(false);

  // pick first question on initial load
  useEffect(() => {
    pickNextRandomQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: pick a random question index not yet asked
  const pickNextRandomQuestion = () => {
    // if we have already asked enough, mark completed
    if (askedQuestions.length >= QUIZ_LENGTH) {
      setQuizCompleted(true);
      return;
    }

    // choose from all indexes that are NOT in askedQuestions
    const remaining = questions
      .map((_, idx) => idx)
      .filter((idx) => !askedQuestions.includes(idx));

    // safety: if somehow we run out, end quiz
    if (remaining.length === 0) {
      setQuizCompleted(true);
      return;
    }

    const randomIndex = remaining[Math.floor(Math.random() * remaining.length)];

    // record that we are asking this one now
    setAskedQuestions((prev) => [...prev, randomIndex]);
    setCurrentQuestionIndex(randomIndex);
    setFeedback("");
    setAnswerLocked(false);
  };

  // when user selects an answer
  const handleAnswer = (selectedOption) => {
    if (answerLocked || currentQuestionIndex === null) return;
    setAnswerLocked(true);

    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (selectedOption === correctAnswer) {
      setScore((s) => s + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect! The answer was "${correctAnswer}".`);
    }
  };

  // go to next question
  const handleNext = () => {
    pickNextRandomQuestion();
  };

  // restart whole quiz
  const restartQuiz = () => {
    setScore(0);
    setFeedback("");
    setAnswerLocked(false);
    setAskedQuestions([]);
    setQuizCompleted(false);
    setCurrentQuestionIndex(null);
    // pick a new first question
    pickNextRandomQuestion();
  };

  // show final screen
  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Completed!</h2>
        <p>
          Your final score: {score} / {QUIZ_LENGTH}
        </p>
        <button onClick={restartQuiz} className="next-btn">
          Restart Quiz
        </button>
      </div>
    );
  }

  // if still loading first question
  if (currentQuestionIndex === null) {
    return <div className="quiz-container">Loading question...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = askedQuestions.length; // 1-based display

  return (
    <div className="quiz-container">
      <h1>Interactive Quiz</h1>
      <p>
        Question {questionNumber} of {QUIZ_LENGTH}
      </p>

      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        disabled={answerLocked}
      />

      <p className="feedback">{feedback}</p>
      <p>Score: {score}</p>

      <button onClick={handleNext} className="next-btn">
        {questionNumber === QUIZ_LENGTH ? "Finish" : "Next Question"}
      </button>
    </div>
  );
}

export default App;
