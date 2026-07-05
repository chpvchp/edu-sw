import React from "react";
import { BASE_URL } from "../api/api";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionTrueFalseProps = {
  question: Question;
  onChange: (idQuestion: string, idAnswer: string, value: boolean) => void;
  data: boolean | any
  results: boolean
}

function CardQuestionTrueFalse({ question, onChange, data, results }: CardQuestionTrueFalseProps) {
  return (
    <div className="p-2 flex flex-col border border-gray-400 rounded bg-white shadow">

      <div className="p-2 flex flex-col border border-gray-400 rounded">

        <div id={question.id_question}>
          <RenderMarkDownLatex
            text={question.question}
          />
        </div>
        
        {question?.path_images && (
          <img 
            className="max-h-64 w-auto object-contain"
            src={`${BASE_URL}/${question?.path_images}`} 
          />
        )}
        
      </div>

      <div className="mt-2 flex flex-col gap-2">

        {question.answers.map((answer) => {

          if (!results) {
            return (
              <div className="flex flex-col gap-2" key={answer.id_answer}>
                <div className="p-2 border border-gray-400 rounded flex flex-col gap-2">
                  <div>
                    <RenderMarkDownLatex 
                      text={answer.answer}
                    />
                  </div>
                  <div className="flex gap-8">
                    <div className="flex gap-2 italic">
                      <input 
                        type="radio"
                        name={answer.id_answer}
                        onChange={() => onChange(question.id_question, answer.id_answer, true)}
                      />
                      <p>Đúng</p>
                    </div>
                    <div className="flex gap-2 italic">
                      <input 
                        type="radio"
                        name={answer.id_answer}
                        onChange={() => onChange(question.id_question, answer.id_answer, false)} 
                      />
                      <p>Sai</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          if (results) {

            const trueAnswer = data?.correct_results?.[question.id_question]?.results?.true_answer
            const falseAnswer = data?.correct_results?.[question.id_question]?.results?.false_answer

            const studentAnswerTrue = data?.student_results?.[question.id_question]?.true_answer ?? []
            const studentAnswerFalse = data?.student_results?.[question.id_question]?.false_answer ?? []

            const isStudentTrue = studentAnswerTrue.includes(answer.id_answer);
            const isStudentFalse = studentAnswerFalse.includes(answer.id_answer);

            const isCorrectTrue = trueAnswer.includes(answer.id_answer);
            const isCorrectFalse = falseAnswer.includes(answer.id_answer);

            let classNameTrue = "";
            let classNameFalse = "";
            let classNameInputTrue = ""
            let classNameInputFalse = ""

            if (isStudentTrue && isCorrectTrue) {
              classNameTrue = "px-2 py-1 border border-blue-400 bg-blue-100 rounded"
              classNameInputTrue = "accent-blue-600"
            } else if (isStudentTrue && !isCorrectTrue) {
              classNameTrue = "px-2 py-1 border border-red-400 bg-red-100 rounded"
              classNameInputTrue = "accent-red-600"
            } else if (!isStudentTrue && isCorrectTrue) {
              classNameTrue = "px-2 py-1 border border-blue-400 bg-blue-100 rounded"
              classNameInputTrue = "accent-blue-600"
            }

            if (isStudentFalse && isCorrectFalse) {
              classNameFalse = "px-2 py-1 border border-blue-400 bg-blue-100 rounded"
              classNameInputFalse = "accent-blue-600"
            } else if (isStudentFalse && !isCorrectFalse) {
              classNameFalse = "px-2 py-1 border border-red-400 bg-red-100 rounded"
              classNameInputFalse = "accent-red-600"
            } else if (!isStudentFalse && isCorrectFalse) {
              classNameFalse = "px-2 py-1 border border-blue-400 bg-blue-100 rounded"
              classNameInputFalse = "accent-blue-600"
            }

            console.log(isCorrectTrue)

            return (
              <div className="flex flex-col gap-2" key={answer.id_answer}>
                <div className="p-2 border border-gray-400 rounded flex flex-col gap-2">
                  <div>
                    <RenderMarkDownLatex 
                      text={answer.answer}
                    />
                  </div>
                  <div className="flex gap-8">
                    <div className="flex gap-2 italic items-center justify-center">
                      <input
                        className={classNameInputTrue}
                        type="radio"
                        checked={isStudentTrue || isCorrectTrue}
                        readOnly
                      />
                      <p className={classNameTrue}>Đúng</p>
                    </div>
                    <div className="flex gap-2 italic items-center justify-center">
                      <input
                        className={classNameInputFalse}
                        type="radio"
                        checked={isStudentFalse || isCorrectFalse}
                        readOnly
                      />
                      <p className={classNameFalse}>Sai</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          




        })}

      </div>



    </div>
  )
};

export default React.memo(CardQuestionTrueFalse);