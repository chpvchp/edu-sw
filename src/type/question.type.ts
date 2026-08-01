export type Answer = {
  id_answer: string;
  answer: string
}

export type Question = {
  id_question: string;
  order: number;
  question: string;
  path_images: string | null;
  type_question: "four_choice" | "true_false" | "short_answer";
  answers: Answer[];
  results: {
    explain: string;
    correct_answer: string;
    true_answer: string[];
    false_answer: string[];
    short_answer: number | string;
  }
}

/**
 * Question | kiểu câu hỏi.
 * Describes the full question payload including display text, optional image, answer options, and the canonical answer key used for scoring.
 * Mô tả đầy đủ payload của câu hỏi gồm nội dung hiển thị, ảnh tùy chọn, các lựa chọn trả lời và đáp án chuẩn dùng để chấm điểm.
 */