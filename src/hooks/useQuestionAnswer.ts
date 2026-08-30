import { useState, useCallback } from "react";
import type { QuestionResult } from "../type/question-answer.type";

/**
 * useQuestionAnswer | hook quản lý câu trả lời của người học.
 * Stores the in-progress answer map in a normalized structure so every question type can be submitted and reviewed consistently.
 * Lưu bản đồ câu trả lời đang làm theo cấu trúc chuẩn hóa để mọi loại câu hỏi đều có thể nộp và xem lại theo cùng một cách.
 */
export function useQuestionAnswer() {
  const [results, setResults] = useState<Record<string, QuestionResult>>({});

  const four_choice = useCallback(
    (idQuestion: string, idAnswer: string) => {
      setResults(prev => ({
        ...prev,
        [idQuestion]: {
          type: "four_choice",
          answer: idAnswer,
        },
      }));
    }, []
  )

  const true_false = useCallback(
    (
      idQuestion: string,
      idAnswer: string,
      value: boolean
    ) => {
      setResults(prev => {
        const current =
          prev[idQuestion]?.type === "true_false"
            ? prev[idQuestion]
            : {
                type: "true_false" as const,
                true_answer: [],
                false_answer: [],
              };

        return {
          ...prev,
          [idQuestion]: {
            type: "true_false",
            true_answer: value
              ? [...current.true_answer.filter(id => id !== idAnswer), idAnswer]
              : current.true_answer.filter(id => id !== idAnswer),

            false_answer: !value
              ? [...current.false_answer.filter(id => id !== idAnswer), idAnswer]
              : current.false_answer.filter(id => id !== idAnswer),
          },
        };
      });
    }, []
  )

  const short_answer = useCallback(
    (idQuestion: string, student_answer: number) => {
      setResults(prev => ({
        ...prev,
        [idQuestion]: {
          type: "short_answer",
          answer: student_answer,
        },
      }));
    }, []
  )
  
  return {
    results,
    four_choice,
    true_false,
    short_answer,
  };
}