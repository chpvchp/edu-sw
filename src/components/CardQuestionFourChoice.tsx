import React from "react";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import type { Question } from "../type/question.type";

type CardQuestionFourChoiceProps = {
  question: Question;
  data: boolean | any
  onChange: (idQuestion: string, idAnswer: string) => void;
  results: boolean
}

/**
 * CardQuestionFourChoice | thẻ câu hỏi bốn lựa chọn.
 * Renders either the answering state or the review state for multiple-choice questions, including answer highlighting after submission.
 * Hiển thị câu hỏi trắc nghiệm bốn lựa chọn ở chế độ làm bài hoặc xem lại, đồng thời tô nổi bật đáp án sau khi nộp.
 */
function CardQuestionFourChoice({ question, onChange, results, data }: CardQuestionFourChoiceProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#dbe7ee] bg-white shadow-sm transition hover:border-[#b8dfd0] hover:shadow-md">
      <div className="border-b border-[#edf2f5] bg-[#f7fafc] p-5 sm:p-6">
        <div id={question?.id_question} className="flex items-start gap-3" style={{ whiteSpace: "pre-line" }}>
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
        {question?.answers.map((answer, answerIndex) => {
          if (!results) {
            return (
              <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-[#dbe7ee] p-3 transition hover:border-[#58ad8d] hover:bg-[#f2faf7] has-[:checked]:border-[#58ad8d] has-[:checked]:bg-[#e9f7f0]" key={answer?.id_answer}>
                <input
                  className="mt-1 h-4 w-4 accent-[#27735f]"
                  type="radio"
                  name={question?.id_question}
                  value={answer?.id_answer}
                  onChange={() => onChange(question?.id_question, answer?.id_answer)}
                />
                <div className="flex min-w-0 items-start gap-2 text-[#18324b]">
                  <span className="font-extrabold text-[#6c8494]">{String.fromCharCode(65 + answerIndex)}.</span>
                  <div className="min-w-0">
                    <RenderMarkDownLatex text={answer.answer} />
                  </div>
                </div>
              </label>
            )
          }
          const isStudentAnswer = data?.student_results?.[question.id_question]?.answer === answer.id_answer;
          const isCorrectAnswer = data?.correct_results?.[question.id_question]?.results.correct_answer === answer.id_answer;
          const resultClassName = isCorrectAnswer
            ? "border-[#58ad8d] bg-[#e9f7f0]"
            : isStudentAnswer
              ? "border-[#e5aaa5] bg-[#fff0ef]"
              : "border-[#dbe7ee] bg-white";

          return (
              <div className={`flex items-start gap-3 rounded-xl border p-3 ${resultClassName}`} key={answer?.id_answer}>
                <input
                  className={`mt-1 h-4 w-4 ${isCorrectAnswer ? "accent-[#27735f]" : "accent-[#b42318]"}`}
                  type="radio"
                  value={answer?.id_answer}
                  checked={isStudentAnswer || isCorrectAnswer}
                  readOnly
                />
                <div className="flex min-w-0 flex-1 items-start gap-2 text-[#18324b]">
                  <span className="font-extrabold text-[#6c8494]">{String.fromCharCode(65 + answerIndex)}.</span>
                  <div className="min-w-0">
                    <RenderMarkDownLatex text={answer.answer} />
                  </div>
                </div>
                {isCorrectAnswer && <span className="shrink-0 text-xs font-bold text-[#27735f]">Đúng</span>}
                {isStudentAnswer && !isCorrectAnswer && <span className="shrink-0 text-xs font-bold text-[#b42318]">Bạn chọn</span>}
              </div>
          )

        })}
      </div>
    </article>
  );
};

export default React.memo(CardQuestionFourChoice);