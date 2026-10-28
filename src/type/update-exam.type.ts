export type ExamMetadata = {
  id_exam: string;
  id_subject: string;
  name_exam: string;
  name_subject: string;
  class_exam: string;
  duration: number;
  created: string;
  updated: string;
  source: string;
};

export type GeneratedExam = ExamMetadata & {
  questions: ExamQuestion[];
};

export type ExamQuestion = {
  id_question: string;
  order: number;
  question: string;
  type_question: "four_choice" | "true_false" | "short_answer";
  path_images: string | null;
  answers: Array<{ id_answer: string; answer: string }>;
  results: {
    explain: string;
    correct_answer: string | null;
    true_answer: string[];
    false_answer: string[];
    short_answer: string;
  };
};
