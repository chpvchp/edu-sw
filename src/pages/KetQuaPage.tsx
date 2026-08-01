import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";
import CardQuestionShortAnswer from "../components/CardQuestionShortAnswer";
import { useLocation } from "react-router-dom";
import { ConvertDate } from "../hook/useConvert";
import { useQuestionAnswer } from "../hook/useQuestionAnswer";
import type { Question } from "../type/question.type";
import type { SubmitQuestionAnswerResponse } from "../type/submit.type";

/**
 * KetQuaPage | trang kết quả.
 * Reconstructs the review view from the submitted result payload and shows the scoring summary beside each rendered question.
 * Tái tạo màn hình xem lại từ payload kết quả đã nộp và hiển thị phần tổng kết điểm cùng từng câu hỏi bên cạnh nhau.
 */
export default function KetQuaPage() {

  const {
    four_choice,
    true_false,
    short_answer,
  } = useQuestionAnswer();

  const { state } = useLocation();
  const storedResults = (() => {
    try {
      const value = sessionStorage.getItem("last_exam_result");
      return value ? JSON.parse(value) as SubmitQuestionAnswerResponse : null;
    } catch {
      return null;
    }
  })();

  const results = (state ?? storedResults) as SubmitQuestionAnswerResponse | null;

  if (!results) {
    return (
      <main className="min-h-screen max-w-7xl flex-1 mx-auto p-4">
        <p>Chưa có kết quả để hiển thị. Hãy quay lại trang bài tập và nộp bài.</p>
      </main>
    )
  }

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  return (
    <main className="min-h-screen max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-10 items-start mx-auto gap-8 lg:gap-2">
      <div className="lg:px-4 lg:py-4 flex flex-col lg:col-span-6 gap-8 order-2 lg:order-1">
        {results?.questions?.map((question: Question) => {
          if (question.type_question === "four_choice") {
            return (
              <CardQuestionFourChoice
                key={question.id_question}
                question={question}
                onChange={four_choice}
                data={results}
                results={true}
              />
            )
          }

          if (question.type_question === "true_false") {
            return (
              <CardQuestionTrueFalse
                key={question.id_question}
                question={question}
                onChange={true_false} 
                data={results}
                results={true}
              />
            )
          }

          if (question.type_question === "short_answer") {
            return (
              <CardQuestionShortAnswer
                key={question.id_question}
                question={question}
                onChange={short_answer}
                data={results}
                results={true}
              />
            )
          }

          return null;

        })}
      </div>

      <div className="lg:px-4 lg:py-4 lg:sticky lg:top-4 gap-4 lg:col-span-4 order-1 lg:order-2">
        <div className="p-2 border border-gray-400 rounded flex flex-col gap-2">
          <h1 className="p-2 font-bold border border-gray-200 rounded-md text-center">{results.score}</h1>
          <div>

            <div className={classNameInfo}>
              <p>Bài Tập:</p>
              <p>{results.name_exam}</p>
            </div>

            <div className={classNameInfo}>
              <p>Môn:</p>
              <p>{results.subject}</p>
            </div>

            <div className={classNameInfo}>
              <p>Câu đúng:</p>
              <p>{results.num_correct}</p>
            </div>

            <div className={classNameInfo}>
              <p>Câu sai:</p>
              <p>{results.num_wrong}</p>
            </div>

            <div className={classNameInfo}>
              <p>Câu chưa làm:</p>
              <p>{results.num_none}</p>
            </div>

            <div className={classNameInfo}>
              <p>Thời gian làm bài:</p>
              <p>{results.student_duration}/{results.duration} phút</p>
            </div>

            <div className={classNameInfo}>
              <p>Ngày tạo:</p>
              <p>{ConvertDate(results.created)}</p>
            </div>

          </div>
        </div>
      </div>

    </main>
  )

}