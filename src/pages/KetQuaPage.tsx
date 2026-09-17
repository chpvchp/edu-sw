import { useEffect } from "react";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";
import CardQuestionShortAnswer from "../components/CardQuestionShortAnswer";
import { useLocation } from "react-router-dom";
import { ConvertDate } from "../hooks/useConvert";
import { useQuestionAnswer } from "../hooks/useQuestionAnswer";
import type { Question } from "../type/question.type";
import type { SubmitQuestionAnswerResponse } from "../type/submit.type";
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

function formatDuration(seconds: number): string {
  const normalizedSeconds = Number(seconds);

  if (!Number.isFinite(normalizedSeconds)) {
    return "Chưa xác định";
  }

  const minutes = Math.floor(normalizedSeconds / 60);
  const remainingSeconds = normalizedSeconds % 60;

  return `${minutes} phút ${String(remainingSeconds).padStart(2, "0")} giây`;
}

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
  const lastExamId = sessionStorage.getItem("last_exam_id");

  useEffect(() => {
    document.title = "Kết Quả và Đáp Án | Edu SW"
  }, [])

  if (!results) {
    return (
      <main className="min-h-screen max-w-7xl flex-1 mx-auto p-4">
        <p>Chưa có kết quả để hiển thị. Hãy quay lại trang bài tập và nộp bài.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-start gap-8 py-10 lg:grid-cols-10">
      <div className="flex flex-col gap-6 lg:col-span-7 lg:order-1 order-2">
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

      <div className="order-1 flex flex-col gap-4 lg:sticky lg:top-24 lg:order-2 lg:col-span-3">
        <div className="rounded-2xl border border-[#dbe7ee] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#27735f]">Kết quả luyện tập</p>
          <div className="mt-4 rounded-2xl bg-[#18324b] p-5 text-center text-white">
            <p className="text-5xl font-extrabold">{results.score}</p>
            <p className="mt-1 text-sm text-white/65">điểm số</p>
          </div>
          <h1 className="mt-5 font-bold leading-snug text-[#18324b]">{results.name_exam}</h1>
          <p className="mt-1 text-sm text-[#6c8494]">{results.subject}</p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-[#e9f7f0] p-3"><CheckCircle2 className="mx-auto h-4 w-4 text-[#27735f]" /><p className="mt-1 text-lg font-extrabold text-[#27735f]">{results.num_correct}</p><p className="text-[11px] text-[#6c8494]">Đúng</p></div>
            <div className="rounded-xl bg-[#fff0ef] p-3"><XCircle className="mx-auto h-4 w-4 text-[#b42318]" /><p className="mt-1 text-lg font-extrabold text-[#b42318]">{results.num_wrong}</p><p className="text-[11px] text-[#6c8494]">Sai</p></div>
            <div className="rounded-xl bg-[#f1f5f7] p-3"><p className="text-lg font-extrabold text-[#587084]">{results.num_none}</p><p className="mt-5 text-[11px] text-[#6c8494]">Bỏ trống</p></div>
          </div>
          <div className="mt-5 border-t border-[#edf2f5] pt-4 text-sm text-[#6c8494]"><div className="flex justify-between gap-4"><span>Thời gian</span><span className="text-right font-bold text-[#18324b]">{formatDuration(results.student_duration)} / {results.duration} phút</span></div><div className="mt-2 flex justify-between gap-4"><span>Cập nhật</span><span className="text-right font-bold text-[#18324b]">{ConvertDate(results.updated)}</span></div></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Link to="/bai-tap" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18324b] p-3 text-sm font-bold text-white transition hover:bg-[#264d6b]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Về danh sách</Link>
            {lastExamId && <Link to={`/bai-tap/${lastExamId}/lam-bai`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbdde6] p-3 text-sm font-bold text-[#18324b] transition hover:bg-[#f2faf7]"><RotateCcw className="h-4 w-4" aria-hidden="true" />Làm lại</Link>}
          </div>
        </div>
      </div>

      

    </main>
  )

}