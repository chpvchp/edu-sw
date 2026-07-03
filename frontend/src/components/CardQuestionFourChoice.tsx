import React from "react";
import { BASE_URL } from "../api/api";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionFourChoiceProps = {
  question: Question;
  data: boolean | any
  onChange: (idQuestion: string, idAnswer: string) => void;
  results: boolean
}

function CardQuestionFourChoice({ question, onChange, results, data }: CardQuestionFourChoiceProps) {
  return (
    <div className="p-2 flex flex-col border border-gray-400 rounded bg-white shadow">

      <div className="p-2 flex flex-col border border-gray-400 rounded">

        <h2 id={question?.id_question}>
          <RenderMarkDownLatex
            text={question?.question}
          />
        </h2>
        
        {question?.path_images && (
          <img 
            className="max-h-64 w-auto object-contain"
            src={`${BASE_URL}/${question?.path_images}`} 
          />
        )}
        
      </div>

      <div className="p-2 flex flex-col gap-2">

        {question?.answers.map((answer) => {

          if (!results) {
            return (
              <div className="flex gap-2" key={answer?.id_answer}>
                <input 
                  type="radio"
                  name={question?.id_question}
                  value={answer?.id_answer}
                  onChange={() => onChange(question?.id_question, answer?.id_answer)}
                />
                <div>
                  <RenderMarkDownLatex 
                    text={answer?.answer}
                  />
                </div>
              </div>
            )
          }

          if (results) {

            let classNameInput = ""
            let checked

            const isStudentAnswer = data?.student_results?.[question.id_question]?.answer === answer.id_answer;
            const isCorrectAnswer = data?.correct_results?.[question.id_question]?.results.correct_answer === answer.id_answer;


            if (isCorrectAnswer) {
              classNameInput = "px-2 py-1 accent-blue-600 border border-blue-400 bg-blue-100 rounded";
            }

            if (isStudentAnswer && !isCorrectAnswer) {
              classNameInput = "px-2 py-1 accent-red-600 border border-red-400 bg-red-100 rounded";
            }

            if (isStudentAnswer || isCorrectAnswer) {
              checked = true
              
            }

            return (
              <div className={`flex gap-2`} key={answer?.id_answer}>
                <input
                  className={classNameInput}
                  type="radio"
                  value={answer?.id_answer}
                  checked={checked}
                  readOnly
                />
                <div className={classNameInput}>
                  <RenderMarkDownLatex 
                    text={answer?.answer}
                  />
                </div>
              </div>
            )
          }

        })}

      </div>



    </div>
  );
};

export default React.memo(CardQuestionFourChoice);