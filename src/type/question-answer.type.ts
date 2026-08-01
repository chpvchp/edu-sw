export type FourChoiceResult = {
  type: "four_choice";
  answer: string;
};

export type TrueFalseResult = {
  type: "true_false";
  true_answer: string[];
  false_answer: string[];
};

export type ShortAnswerResult = {
  type: "short_answer";
  answer: number;
};

export type QuestionResult = FourChoiceResult | TrueFalseResult | ShortAnswerResult;

/**
 * QuestionResult | kết quả câu trả lời.
 * Defines the normalized in-memory answer shape for every supported question type so the submit and review flow can stay type-safe.
 * Định nghĩa dạng câu trả lời chuẩn hóa trong bộ nhớ cho mọi loại câu hỏi được hỗ trợ để luồng nộp bài và xem lại vẫn an toàn về kiểu.
 */