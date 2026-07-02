import type { QuestionResult } from "../hook/useQuestionAnswer";

export type SubmitQuestionAnswer = {
  id_exam: string;
  results: Record<string, QuestionResult>
}