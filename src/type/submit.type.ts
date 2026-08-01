import type { QuestionResult } from "./question-answer.type";
import type { Question } from "./question.type";

export type SubmitQuestionAnswer = {
  id_exam: string;
  results: Record<string, QuestionResult>
}

export type SubmitQuestionAnswerResponse = {
  score: number;
  name_exam: string;
  subject: string;
  num_correct: number;
  num_wrong: number;
  num_none: number;
  duration: number;
  student_duration: number | string;
  created: string;
  questions: Question[];
  correct_results: Record<string, { type: Question["type_question"]; results: Question["results"] }>;
  student_results: Record<string, QuestionResult>;
};

/**
 * SubmitQuestionAnswer / SubmitQuestionAnswerResponse | dữ liệu nộp bài / phản hồi nộp bài.
 * The request carries the exam id and normalized answers; the response returns score, counters, and both student and correct result maps for review rendering.
 * Request mang theo id đề và câu trả lời đã chuẩn hóa; response trả về điểm số, các bộ đếm, cùng map đáp án của người học và đáp án chuẩn để dựng màn hình xem lại.
 */