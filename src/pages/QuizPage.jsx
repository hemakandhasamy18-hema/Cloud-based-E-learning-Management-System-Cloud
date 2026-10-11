import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { AlertCircle, Check, X, Award, Timer, ChevronRight } from "lucide-react";

export default function QuizPage({ quiz, onClose }) {
  const { submitQuiz } = useData();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({}); // mapping: questionIdx -> optionIdx
  
  // Timer state (600 seconds = 10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    if (quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizSubmitted]);

  const handleSelectOption = (optIdx) => {
    if (quizSubmitted) return;
    setSelectedOption(optIdx);
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(answers[currentIdx + 1] !== undefined ? answers[currentIdx + 1] : null);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizSubmitted) return;
    setQuizSubmitted(true);

    // Grade quiz
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    // Submit scores through DataContext
    await submitQuiz(quiz.id, correctCount, quiz.questions.length);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const question = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between">
        
        {/* QUIZ ACTIVE VIEW */}
        {!quizSubmitted ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{quiz.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Question {currentIdx + 1} of {totalQuestions}</p>
              </div>
              <div className="flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-2xl font-mono text-sm font-bold border border-rose-200/50 dark:border-rose-900/35">
                <Timer size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300" 
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }} 
              />
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-sm font-semibold leading-relaxed text-slate-850 dark:text-slate-100">
                {question.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {question.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx || answers[currentIdx] === oIdx;
                
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-slate-300 dark:border-slate-700"
                    }`}>
                      {isSelected && <Check size={10} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">Quiz results automatically graded.</span>
              <button
                type="button"
                onClick={handleNext}
                disabled={answers[currentIdx] === undefined}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 disabled:opacity-50"
              >
                <span>{currentIdx === totalQuestions - 1 ? "Submit Answers" : "Next Question"}</span>
                <ChevronRight size={12} />
              </button>
            </div>

          </div>
        ) : (
          /* QUIZ SCORE REPORT VIEW */
          <div className="text-center space-y-6">
            <div className="inline-flex h-16 w-16 bg-amber-500/10 text-amber-500 items-center justify-center rounded-2xl mb-2">
              <Award size={36} />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Quiz Evaluation Completed</h3>
              <p className="text-xs text-slate-500 mt-1">Review your score metrics below</p>
            </div>

            {/* Score Ring */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl max-w-sm mx-auto">
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                {score} / {totalQuestions}
              </p>
              <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wide">
                Percentage Score: {Math.round((score / totalQuestions) * 100)}%
              </p>
            </div>

            {/* Question Review List */}
            <div className="text-left space-y-4 max-h-60 overflow-y-auto pr-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Answer Review</p>
              {quiz.questions.map((q, idx) => {
                const studAns = answers[idx];
                const correctAns = q.correctAnswer;
                const isCorrect = studAns === correctAns;

                return (
                  <div key={idx} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <p className="font-bold text-slate-850 dark:text-slate-200">{idx + 1}. {q.question}</p>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-slate-500">
                        <span className="font-bold mr-1">Your choice:</span> 
                        <span className={isCorrect ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                          {q.options[studAns] || "None"}
                        </span>
                        {isCorrect ? <Check size={12} className="text-emerald-600 ml-1.5" /> : <X size={12} className="text-rose-600 ml-1.5" />}
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-600 font-semibold flex items-center">
                          <span className="font-bold mr-1 text-slate-500">Correct Answer:</span>
                          <span>{q.options[correctAns]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Finish Review & Close Room
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
