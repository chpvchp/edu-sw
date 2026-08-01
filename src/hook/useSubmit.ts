import { useState } from "react";
import { postQuestionAnswer } from "../api/exam.api";
import type { SubmitQuestionAnswer } from "../type/submit.type";

/**
 * useSubmitQuestionAnswer | hook nộp bài.
 * Mimics the pending state of an async mutation while evaluating the submission locally against the static exam data.
 * Mô phỏng trạng thái chờ của một mutation bất đồng bộ trong khi chấm bài cục bộ dựa trên dữ liệu đề tĩnh.
 */
export function useSubmitQuestionAnswer() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (studentSubmit: SubmitQuestionAnswer) => {
    setIsPending(true);

    try {
      return await postQuestionAnswer(studentSubmit);
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}