import { useState, useCallback } from "react";

export type FourChoiceResult = {
  type: "four_choice";
  answer: string;
};

export type TrueFalseResult = {
  type: "true_false";
  true_answer: string[];
  false_answer: string[];
};

export type ShortAnswer = {
  type: "short_answer";
  answer: number
}

export type QuestionResult = FourChoiceResult | TrueFalseResult | ShortAnswer;

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