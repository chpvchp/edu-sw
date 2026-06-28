export type Answer = {
  id_answer: string;
  answer: string
}

export type Question = {
  id_question: string;
  question: string;
  path_images: string;
  type_question: string;
  answers: Answer[];
  results: {
    explain: string;
    correct_answer: string
  }
}