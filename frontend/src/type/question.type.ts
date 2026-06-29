export type Answer = {
  id_answer: string;
  answer: string
}

export type Question = {
  id_question: string;
  order: number;
  question: string;
  path_images: string;
  type_question: "four_choice" | "true_false";
  answers: Answer[];
  results: {
    explain: string;
    correct_answer: string
  }
}