import { useParams } from "react-router-dom"
import { useInfoExam, useQuestions } from "../hook/useExam";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import { useState } from "react";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";

type FourChoiceResult = {
  type: "four_choice";
  answer: string;
};

type TrueFalseResult = {
  type: "true_false";
  true_answer: string[];
  false_answer: string[];
};

type QuestionResult = FourChoiceResult | TrueFalseResult;

export default function LamBaiPage() {
  const { id_exam } = useParams()
  const idExam = String(id_exam)
  const { data } = useQuestions( idExam );
  const { data: examInfo } = useInfoExam( idExam );
  const [results, setResults] = useState<Record<string, QuestionResult>>({});

  const onChangeInput = {
    four_choice: (idQuestion: string, idAnswer: string) => {
      setResults(prev => ({
        ...prev,
        [idQuestion]: {
          type: "four_choice",
          answer: idAnswer,
        },
      }));
    },
    true_false: (
      idQuestion: string,
      idAnswer: string,
      value: boolean
    ) => {
      setResults(prev => {
        const current =
          prev[idQuestion]?.type === "true_false"
            ? prev[idQuestion]
            : {
                type: "true_false" as const,
                true_answer: [],
                false_answer: [],
              };

        return {
          ...prev,
          [idQuestion]: {
            type: "true_false",
            true_answer: value
              ? [...current.true_answer.filter(id => id !== idAnswer), idAnswer]
              : current.true_answer.filter(id => id !== idAnswer),

            false_answer: !value
              ? [...current.false_answer.filter(id => id !== idAnswer), idAnswer]
              : current.false_answer.filter(id => id !== idAnswer),
          },
        };
      });
    },
  }

  return (
    <main className="min-h-screen max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-10  items-start mx-auto">
      
      <div className="px-8 py-4 flex flex-col lg:col-span-6 gap-8">
        {data?.map((question) => {
          if (question.type_question === "four_choice") {
            return (
              <CardQuestionFourChoice
                key={question.id_question}
                question={question}
                onChange={onChangeInput.four_choice} 
              />
            )
          }

          if (question.type_question === "true_false") {
            return (
              <CardQuestionTrueFalse
                key={question.id_question}
                question={question}
                onChange={onChangeInput.true_false} 
              />
            )
          }

          return null;

        })}
      </div>

      <div className="px-8 py-4 sticky top-4 flex flex-col gap-4 lg:col-span-4">

        <div className="p-2 border border-gray-400 rounded flex flex-col">
          <div className="p-2 border border-gray-400 rounded text-center font-bold">
            <h1>{examInfo?.name_exam}</h1>
          </div>
          <div>

          </div>
        </div>
        
        <div className="p-2 border border-gray-400 rounded bg-white grid grid-cols-10 gap-2 text-sm">
          {data?.map((question) => {

            const isAnswered = !!results[question.id_question];
            
            return (
              <a
                key={question.id_question}
                href={`#${question.id_question}`}
                className={`flex items-center justify-center border border-gray-400 rounded transition duration-200 hover:bg-blue-800 hover:text-white hover:font-bold 
                  ${isAnswered ? "bg-blue-600 font-bold text-white": "bg-white"}`}
              >
                {question.order}
              </a>

          )})}
        </div>

      </div>

    </main>
  )
}