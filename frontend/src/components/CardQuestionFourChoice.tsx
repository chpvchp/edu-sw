import { BASE_URL } from "../api/api";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionFourChoiceProps = {
  question: Question;
  onChange: (idQuestion: string, idAnswer: string) => void;
}

export default function CardQuestionFourChoice({ question, onChange }: CardQuestionFourChoiceProps) {
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

        {question?.answers.map((answer) => (

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

        ))}

      </div>



    </div>
  )
}