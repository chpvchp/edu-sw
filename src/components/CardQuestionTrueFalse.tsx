import React from "react";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionTrueFalseProps = {
  question: Question;
  onChange: (idQuestion: string, idAnswer: string, value: boolean) => void;
  data: boolean | any
  results: boolean
}

/**
 * CardQuestionTrueFalse | thẻ câu hỏi đúng sai.
 * Handles the two-state answer model used by true/false questions and compares student selections against the exam key on review.
 * Xử lý mô hình đáp án hai trạng thái của câu hỏi đúng/sai và so sánh lựa chọn của người học với đáp án chuẩn khi xem lại.
 */
function CardQuestionTrueFalse({ question, onChange, data, results }: CardQuestionTrueFalseProps) {
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
      <div className="flex flex-col gap-3 p-5 sm:p-6">
        {question.answers.map((answer, answerIndex) => {
          if (!results) {
            return (
              <div className="rounded-xl border border-[#dbe7ee] p-4" key={answer.id_answer}>
                <div className="flex min-w-0 items-start gap-2 text-[#18324b]">
                    <span className="font-extrabold text-[#6c8494]">{String.fromCharCode(97 + answerIndex)}.</span>
                    <div className="min-w-0">
                      <RenderMarkDownLatex text={answer.answer} />
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#b8dfd0] p-2 text-sm font-bold text-[#27735f] transition hover:bg-[#e9f7f0]">
                      <input 
                        className="accent-[#27735f]"
                        type="radio"
                        name={answer.id_answer}
                        onChange={() => onChange(question.id_question, answer.id_answer, true)}
                      />
                      Đúng
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e5aaa5] p-2 text-sm font-bold text-[#b42318] transition hover:bg-[#fff0ef]">
                      <input 
                        className="accent-[#b42318]"
                        type="radio"
                        name={answer.id_answer}
                        onChange={() => onChange(question.id_question, answer.id_answer, false)} 
                      />
                      Sai
                    </label>
                </div>
              </div>
            )
          }

          if (results) {

            const trueAnswer = data?.correct_results?.[question.id_question]?.results?.true_answer
            const falseAnswer = data?.correct_results?.[question.id_question]?.results?.false_answer

            const studentAnswerTrue = data?.student_results?.[question.id_question]?.true_answer ?? []
            const studentAnswerFalse = data?.student_results?.[question.id_question]?.false_answer ?? []

            const isStudentTrue = studentAnswerTrue.includes(answer.id_answer);
            const isStudentFalse = studentAnswerFalse.includes(answer.id_answer);

            const isCorrectTrue = trueAnswer.includes(answer.id_answer);
            const isCorrectFalse = falseAnswer.includes(answer.id_answer);

            let classNameTrue = "border-[#dbe7ee] bg-white text-[#6c8494]";
            let classNameFalse = "border-[#dbe7ee] bg-white text-[#6c8494]";

            if (isStudentTrue && isCorrectTrue) {
              classNameTrue = "border-green-800 bg-green-200 text-[#27735f]"
            } else if (isStudentTrue && !isCorrectTrue) {
              classNameTrue = "border-red-800 bg-red-400 text-[#b42318]"
            } else if (!isStudentTrue && isCorrectTrue) {
              classNameTrue = "border-green-800 bg-green-200 text-[#27735f]"
            }

            if (isStudentFalse && isCorrectFalse) {
              classNameFalse = "border-green-800 bg-green-200 text-[#27735f]"
            } else if (isStudentFalse && !isCorrectFalse) {
              classNameFalse = "border-red-800 bg-red-400 text-[#b42318]"
            } else if (!isStudentFalse && isCorrectFalse) {
              classNameFalse = "border-green-800 bg-green-200 text-[#27735f]"
            }

            return (
              <div className="rounded-xl border border-[#dbe7ee] p-4" key={answer.id_answer}>
                  <div className="flex min-w-0 items-start gap-2 text-[#18324b]">
                    <span className="font-extrabold text-[#6c8494]">{String.fromCharCode(97 + answerIndex)}.</span>
                    <div className="min-w-0">
                      <RenderMarkDownLatex text={answer.answer} />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className={`flex items-center justify-center gap-2 rounded-lg border p-2 text-sm font-bold ${classNameTrue}`}>
                      <input
                        className="accent-[#27735f]"
                        type="radio"
                        checked={isStudentTrue || isCorrectTrue}
                        readOnly
                      />
                      <span>Đúng</span>
                    </div>
                    <div className={`flex items-center justify-center gap-2 rounded-lg border p-2 text-sm font-bold ${classNameFalse}`}>
                      <input
                        className="accent-[#b42318]"
                        type="radio"
                        checked={isStudentFalse || isCorrectFalse}
                        readOnly
                      />
                      <span>Sai</span>
                    </div>
                  </div>
              </div>
            )
          }
          




        })}

      </div>



    </article>
  )
};

export default React.memo(CardQuestionTrueFalse);