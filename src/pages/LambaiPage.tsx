import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useInfoExam, useQuestions } from "../hooks/useExam";
import CardQuestionFourChoice from "../components/CardQuestionFourChoice";
import CardQuestionTrueFalse from "../components/CardQuestionTrueFalse";
import CardQuestionShortAnswer from "../components/CardQuestionShortAnswer";
import { useQuestionAnswer } from "../hooks/useQuestionAnswer";
import { useSubmitQuestionAnswer } from "../hooks/useSubmit";
import { ConvertDate } from "../hooks/useConvert";
import { AlertTriangle, Check, Clock3, Send } from "lucide-react";

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
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const hasSubmitted = useRef(false);
  const resultsRef = useRef(results);

  const navigate = useNavigate();

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted.current) {
      return;
    }

    hasSubmitted.current = true;

    try {
      const data = await mutateAsync({
        id_exam: idExam,
        results: resultsRef.current,
      });

      sessionStorage.setItem("last_exam_result", JSON.stringify(data));

      navigate("/bai-tap/ket-qua", {
        state: data
      });
    } catch (err) {
      console.log(err)
    }
  }, [idExam, mutateAsync, navigate]);

  useEffect(() => {
    if (!examInfo?.duration) {
      return;
    }

    const nextDeadline = Date.now() + examInfo.duration * 60 * 1000;

    setDeadline(nextDeadline);
    setRemainingSeconds(examInfo.duration * 60);
    hasSubmitted.current = false;
  }, [examInfo?.duration]);

  useEffect(() => {
    if (deadline === null || hasSubmitted.current) {
      return;
    }

    const updateRemainingTime = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(seconds);
    };

    updateRemainingTime();
    const timer = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(timer);
  }, [deadline]);

  useEffect(() => {
    if (remainingSeconds === 0 && deadline !== null) {
      void handleSubmit();
    }
  }, [deadline, handleSubmit, remainingSeconds]);

  const formattedRemainingTime = remainingSeconds === null
    ? "--:--"
    : `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  const answeredCount = data?.filter((question) => Boolean(results[question.id_question])).length ?? 0;
  const isUrgent = remainingSeconds !== null && remainingSeconds <= 60;
  const isWarning = remainingSeconds !== null && remainingSeconds <= 300;
  const timerClassName = isUrgent
    ? "border-[#f2b8b5] bg-[#fff0ef] text-[#b42318]"
    : isWarning
      ? "border-[#f1d39f] bg-[#fff8e8] text-[#a85c18]"
      : "border-[#b8dfd0] bg-[#e9f7f0] text-[#27735f]";

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
    <main className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-start gap-8 py-8 lg:grid-cols-10">
      
      <div className="flex flex-col gap-6 lg:col-span-7">
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

      <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-3">

        <div className="flex flex-col gap-4 rounded-2xl border border-[#dbe7ee] bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#27735f]">Đang làm bài</p>
            <h1 className="mt-2 font-bold leading-snug text-[#18324b]">{examInfo?.name_exam}</h1>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f7fafc] p-3 text-xs text-[#6c8494]">
            <div><p>Môn học</p><p className="mt-1 font-bold text-[#18324b]">{examInfo?.name_subject}</p></div>
            <div><p>Lớp</p><p className="mt-1 font-bold text-[#18324b]">{examInfo?.class_exam}</p></div>
            <div><p>Thời lượng</p><p className="mt-1 font-bold text-[#18324b]">{examInfo?.duration} phút</p></div>
            <div><p>Cập nhật</p><p className="mt-1 font-bold text-[#18324b]">{ConvertDate(examInfo?.updated ?? "")}</p></div>
          </div>
          <div className={`rounded-xl border p-4 text-center ${timerClassName}`}>
            <div className="flex items-center justify-center gap-2 text-sm font-bold"><Clock3 className="h-4 w-4" aria-hidden="true" />Thời gian còn lại</div>
            <p className="mt-1 text-3xl font-extrabold tabular-nums" aria-live="polite">
              {formattedRemainingTime}
            </p>
            {isWarning && <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />Sắp hết giờ</p>}
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs font-bold text-[#6c8494]"><span>Tiến độ</span><span>{answeredCount}/{data?.length ?? 0} câu</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e8eff3]"><div className="h-full rounded-full bg-[#58ad8d] transition-all" style={{ width: `${data?.length ? answeredCount / data.length * 100 : 0}%` }} /></div>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#18324b] p-3 text-sm font-bold text-white transition hover:bg-[#264d6b] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending || remainingSeconds === 0}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isPending ? "Đang nộp..." : "Nộp bài"}
            </button>
          </div>
        </div>
        
        <div className="rounded-2xl border border-[#dbe7ee] bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-[#18324b]">Điều hướng câu hỏi</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5">
            {data?.map((question) => {

            const isAnswered = !!results[question.id_question];
            
            return (
              <a
                key={question.id_question}
                href={`#${question.id_question}`}
                aria-label={`Đi tới câu ${question.order}${isAnswered ? ", đã trả lời" : ", chưa trả lời"}`}
                className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-bold transition hover:border-[#18324b] hover:bg-[#e9f7f0] 
                  ${isAnswered ? "border-[#58ad8d] bg-[#e9f7f0] text-[#27735f]": "border-[#dbe7ee] bg-white text-[#6c8494]"}`}
              >
                {question.order}
              </a>

            )})}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[#6c8494]"><span className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[#27735f]" />Đã trả lời</span><span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-[#dbe7ee]" />Chưa trả lời</span></div>
        </div>

      </div>

    </main>
  )
}