import { useMutation } from "@tanstack/react-query";
import { postQuestionAnswer } from "../api/exam.api";

export function useSubmitQuestionAnswer() {
  return useMutation({
    mutationFn: postQuestionAnswer,
  })
}