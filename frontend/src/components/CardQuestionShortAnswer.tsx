import React from "react";
import { useState } from "react";
import { BASE_URL } from "../api/api";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionShortAnswerProps = {
  question: Question;
  onChange: (idQuestion: string, student_answer: number) => void;
}

function CardQuestionShortAnswer({ question, onChange }: CardQuestionShortAnswerProps) {
  const [ value, setValue ] = useState("")

  return (
    <div className="p-2 flex flex-col border border-gray-400 rounded bg-white shadow">

      <div className="p-2 flex flex-col border border-gray-400 rounded">

        <h2 id={question.id_question}>
          <RenderMarkDownLatex
            text={question.question}
          />
        </h2>
        
        {question?.path_images && (
          <img 
            className="max-h-64 w-auto object-contain"
            src={`${BASE_URL}/${question?.path_images}`} 
          />
        )}
        
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <div>
          <input
            className="p-2"
            type="text" 
            placeholder="Nhập đáp án tại đây..."
            value={value}
            onChange={(e) => {
              const student_answer = e.target.value
              setValue(student_answer)
              onChange(question.id_question, Number(student_answer))
            }}
          />
        </div>
      </div>



    </div>
  )
};

export default React.memo(CardQuestionShortAnswer);