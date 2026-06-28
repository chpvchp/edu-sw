import { BASE_URL } from "../api/api";
import { useParams } from "react-router-dom"
import { useQuestions } from "../hook/useExam";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";

export default function LamBaiPage() {
  const { id_exam } = useParams()
  const idExam = String(id_exam)
  const { data } = useQuestions( idExam );
  

  return (
    <main className="flex-1 flex flex-col bg-slate-50">
      
      {data?.map((question) => (
        
        <div>

          <div>

            <h2>
              <RenderMarkDownLatex
                text={question?.question}
              />
            </h2>
            
            {question?.path_images && (
              <img src={`${BASE_URL}/${question?.path_images}`} />
            )}
            
          </div>

          <div>

            {question?.answers.map((answer) => (

              <div>
                <input type="radio" />
                <p>
                  <RenderMarkDownLatex 
                    text={answer?.answer}
                  />
                </p>
              </div>

            ))}

          </div>



        </div>

      ))}

    </main>
  )
}