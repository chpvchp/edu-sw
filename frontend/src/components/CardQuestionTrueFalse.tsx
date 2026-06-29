import { BASE_URL } from "../api/api";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionTrueFalseProps = {
  question: Question;
  onChange: (idQuestion: string, idAnswer: string, value: boolean) => void;
}

export default function CardQuestionTrueFalse({ question, onChange }: CardQuestionTrueFalseProps) {
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

        {question.answers.map((answer) => (

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

        ))}

      </div>



    </div>
  )
}