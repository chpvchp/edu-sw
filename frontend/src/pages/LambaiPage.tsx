import { useParams } from "react-router-dom"
import { useInfoExam, useQuestions } from "../hook/useExam";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";

export default function LamBaiPage() {
  const { id_exam } = useParams()
  const idExam = String(id_exam)
  const { data } = useQuestions( idExam );
  const { data: examInfo } = useInfoExam( idExam );
  

  return (
    <main className="min-h-screen p-4 grid grid-cols-1 lg:grid-cols-2  items-start">
      
      <div className="px-8 py-4 flex flex-col gap-8">
        {data?.map((question) => (
        
          <CardQuestionFourChoice
            key={question?.id_question}
            question={question} 
          />

        ))}
      </div>

      <div className="px-8 py-4 sticky top-4">

        <div>
          <h1>{examInfo?.name_exam}</h1>
        </div>
        
        <div className="p-2 border border-gray-400 rounded bg-white grid grid-cols-10 gap-2">
          {data?.map((question) => (
            <a
              key={question.id_question}
              href={`#${question.id_question}`}
              className="flex items-center justify-center h-10 border border-gray-400 rounded transition duration-200 hover:bg-blue-600 hover:text-white hover:font-bold"
            >
              {question.order}
            </a>
          ))}
        </div>

      </div>

    </main>
  )
}