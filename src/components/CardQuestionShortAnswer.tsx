import React from "react";
import { useState } from "react";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionShortAnswerProps = {
  question: Question;
  onChange: (idQuestion: string, student_answer: number) => void;
  data: boolean | any
  results: boolean
}

/**
 * CardQuestionShortAnswer | thẻ câu hỏi tự luận ngắn.
 * Accepts a numeric answer during practice and later shows both the submitted value and the correct value when reviewing results.
 * Nhận đáp án số trong lúc làm bài và sau đó hiển thị cả giá trị đã nộp lẫn giá trị đúng khi xem lại kết quả.
 */
function CardQuestionShortAnswer({ question, onChange, data, results }: CardQuestionShortAnswerProps) {
  const [ value, setValue ] = useState("")

  if (!results) {
    return (
      <article className="overflow-hidden rounded-2xl border border-[#dbe7ee] bg-white shadow-sm transition hover:border-[#b8dfd0] hover:shadow-md">
        <div className="border-b border-[#edf2f5] bg-[#f7fafc] p-5 sm:p-6">
          <div id={question.id_question} className="flex items-start gap-3">
            <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f7f0] px-2 text-sm font-extrabold text-[#27735f]">{question.order}</span>
            <div className="min-w-0">
              <RenderMarkDownLatex text={question.question} />
            </div>
          </div>
          {question?.path_images && (
            <img
              className="mt-5 max-h-72 w-full rounded-xl border border-[#dbe7ee] bg-white object-contain p-2"
              src={question.path_images} 
              alt={`Hình minh họa câu ${question.order}`}
            />
          )}
        </div>
        <div className="p-5 sm:p-6">
          <label className="text-xs font-bold uppercase tracking-widest text-[#6c8494]" htmlFor={`${question.id_question}-answer`}>Câu trả lời của bạn</label>
            <input
              id={`${question.id_question}-answer`}
              className="mt-2 w-full rounded-xl border border-[#cbdde6] bg-white p-3 text-[#18324b] outline-none transition placeholder:text-[#9ab0bc] focus:border-[#58ad8d] focus:ring-4 focus:ring-[#e9f7f0]"
              type="text" 
              placeholder="Nhập đáp án tại đây..."
              value={value}
              onChange={(e) => {
                const student_answer = e.target.value
                setValue(student_answer)
                onChange(question.id_question, Number(student_answer))
              }}
            />
        </div>
      </article>
    )
  }
  
  if (results) {

    let classNameInput = "px-2 py-1 border border-red-400 bg-red-100 rounded"

    const studentAnswer = data?.student_results?.[question.id_question]?.answer

    const correctAnswer = data?.correct_results?.[question.id_question]?.results.short_answer

    const isCorrect = Number(studentAnswer) === Number(correctAnswer)

    if (isCorrect) {
      classNameInput = "px-2 py-1 border border-blue-400 bg-blue-100 rounded";
    }

    return (
      <article className="overflow-hidden rounded-2xl border border-[#dbe7ee] bg-white shadow-sm">
        <div className="border-b border-[#edf2f5] bg-[#f7fafc] p-5 sm:p-6">
          <div id={question.id_question} className="flex items-start gap-3">
            <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f7f0] px-2 text-sm font-extrabold text-[#27735f]">{question.order}</span>
            <div className="min-w-0">
              <RenderMarkDownLatex text={question.question} />
            </div>
          </div>
          {question?.path_images && (
            <img
              className="mt-5 max-h-72 w-full rounded-xl border border-[#dbe7ee] bg-white object-contain p-2"
              src={question.path_images} 
              alt={`Hình minh họa câu ${question.order}`}
            />
          )}
        </div>
        <div className="flex flex-col gap-3 p-5 sm:p-6">
            <input
              className={`rounded-xl border p-3 font-semibold ${classNameInput}`}
              type="text" 
              value={`Đáp án của bạn: ${studentAnswer ?? "Chưa làm!"}`}
              readOnly
            />
            <input
              className="rounded-xl border border-[#b8dfd0] bg-[#e9f7f0] p-3 font-semibold text-[#27735f]"
              type="text" 
              value={`Đáp án đúng: ${correctAnswer}`}
              readOnly
            />
        </div>
      </article>
    )
  }


};

export default React.memo(CardQuestionShortAnswer);