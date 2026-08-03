import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useInfoExam, useQuestions } from "../hook/useExam";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";
import CardQuestionShortAnswer from "../components/CardQuestionShortAnswer";
import { useQuestionAnswer } from "../hook/useQuestionAnswer";
import { useSubmitQuestionAnswer } from "../hook/useSubmit";
import { ConvertDate } from "../hook/useConvert";

/**
 * LamBaiPage | trang làm bài.
 * Renders the exam workspace, captures the student's answers, and submits the finished payload for local scoring and result navigation.
 * Hiển thị không gian làm bài, ghi nhận câu trả lời của người học và nộp payload hoàn chỉnh để chấm cục bộ rồi chuyển sang trang kết quả.
 */
export default function LamBaiPage() {
  const { id_exam } = useParams()
  const idExam = String(id_exam)
  const { data, isLoading, isError } = useQuestions( idExam );
  const { data: examInfo } = useInfoExam( idExam );
  const {
    results,
    four_choice,
    true_false,
    short_answer,
  } = useQuestionAnswer();
  const { mutateAsync, isPending } = useSubmitQuestionAnswer();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = await mutateAsync({
        id_exam: idExam,
        results: results,
      });

      sessionStorage.setItem("last_exam_result", JSON.stringify(data));

      navigate("/bai-tap/ket-qua", {
        state: data
      });
    } catch (err) {
      console.log(err)
    }
  };

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  useEffect(() => {
    if (examInfo?.name_exam) {
      document.title = `${examInfo.name_exam} | Edu SW`;
    } else {
      document.title = "Đang tải... | Edu SW";
    }
  }, [examInfo?.name_exam]);

  if (isLoading) return <p className="p-4 mx-auto">Đang tải đề...</p>
  if (isError) return <p className="p-4 mx-auto">Máy chủ lỗi!</p>

  return (
    <main className="min-h-screen max-w-7xl p-4 grid grid-cols-1 lg:grid-cols-10 items-start mx-auto gap-8 lg:gap-2">
      
      <div className="lg:px-4 lg:py-4 flex flex-col lg:col-span-6 gap-8">
        {data?.map((question) => {
          if (question.type_question === "four_choice") {
            return (
              <CardQuestionFourChoice
                key={question.id_question}
                question={question}
                onChange={four_choice}
                data={false}
                results={false}
              />
            )
          }

          if (question.type_question === "true_false") {
            return (
              <CardQuestionTrueFalse
                key={question.id_question}
                question={question}
                onChange={true_false}
                data={false}
                results={false}
              />
            )
          }

          if (question.type_question === "short_answer") {
            return (
              <CardQuestionShortAnswer
                key={question.id_question}
                question={question}
                onChange={short_answer}
                data={false}
                results={false}
              />
            )
          }

          return null;

        })}
      </div>

      <div className="lg:px-4 lg:py-4 sticky top-4 flex flex-col gap-4 lg:col-span-4">

        <div className="p-2 border border-gray-400 rounded flex flex-col gap-2">
          <div className="p-2 border border-gray-400 rounded text-center font-bold">
            <h1>{examInfo?.name_exam}</h1>
          </div>
          <div className="p-2 border border-gray-400 rounded">
            <div className={classNameInfo}>
              <p>Môn: </p>
              <p>{examInfo?.name_subject}</p>
            </div>
            <div className={classNameInfo}>
              <p>Thời gian làm bài: </p>
              <p>{examInfo?.duration} phút</p>
            </div>
            <div className={classNameInfo}>
              <p>Ngày tạo: </p>
              <p>{ConvertDate(examInfo?.created ?? "")}</p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="p-2 flex justify-center items-center bg-blue-600 text-white font-bold rounded border border-gray-50 transition duration-200 hover:bg-blue-800 hover:scale-105 active:scale-90"
              disabled={isPending}
              onClick={handleSubmit}
            >
              {isPending ? "Đang nộp..." : "Nộp bài"}
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