import { useParams } from "react-router-dom"
import { useInfoExam, useQuestions } from "../hook/useExam";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";
import CardQuestionShortAnswer from "../components/CardQuestionShortAnswer";
import { useQuestionAnswer } from "../hook/useQuestionAnswer";
import { useSubmitQuestionAnswer } from "../hook/useSubmit";

export default function LamBaiPage() {
  const { id_exam } = useParams()
  const idExam = String(id_exam)
  const { data } = useQuestions( idExam );
  const { data: examInfo } = useInfoExam( idExam );
  const {
    results,
    four_choice,
    true_false,
    short_answer,
  } = useQuestionAnswer();
  const { mutate } = useSubmitQuestionAnswer();

  return (
    <main className="min-h-screen max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-10  items-start mx-auto">
      
      <div className="px-8 py-4 flex flex-col lg:col-span-6 gap-8">
        {data?.map((question) => {
          if (question.type_question === "four_choice") {
            return (
              <CardQuestionFourChoice
                key={question.id_question}
                question={question}
                onChange={four_choice} 
              />
            )
          }

          if (question.type_question === "true_false") {
            return (
              <CardQuestionTrueFalse
                key={question.id_question}
                question={question}
                onChange={true_false} 
              />
            )
          }

          if (question.type_question === "short_answer") {
            return (
              <CardQuestionShortAnswer
                key={question.id_question}
                question={question}
                onChange={short_answer}
              />
            )
          }

          return null;

        })}
      </div>

      <div className="px-8 py-4 sticky top-4 flex flex-col gap-4 lg:col-span-4">

        <div className="p-2 border border-gray-400 rounded flex flex-col gap-2">
          <div className="p-2 border border-gray-400 rounded text-center font-bold">
            <h1>{examInfo?.name_exam}</h1>
          </div>
          <div className="flex justify-center items-center">
            <button 
              className="p-2 flex justify-center items-center bg-blue-600 text-white font-bold rounded border border-gray-50 transition duration-200 hover:bg-blue-800 hover:scale-105 active:scale-90"
              onClick={() => {
                mutate({
                  id_exam: idExam,
                  results: results,
                })
              }}
            >
              Nộp bài
            </button>
          </div>
        </div>
        
        <div className="p-2 border border-gray-400 rounded bg-white grid grid-cols-10 gap-2 text">
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