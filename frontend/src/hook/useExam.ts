import { useQuery } from "@tanstack/react-query"
import type { Exam } from "../type/exam.type"
import { getExam, getInfoExam, getQuestionsExam } from "../api/exam.api"
import type { InfoExam } from "../type/infoexam.type";
import type { Question } from "../type/question.type";

export const useListExam = () => {
  return useQuery<Exam[]>({
    queryKey: ["list-exams"],
    queryFn: getExam,
  });
};

export const useInfoExam = ( id_exam: string ) => {
  return useQuery<InfoExam>({
    queryKey: ["info-exam", id_exam],
    queryFn: () => getInfoExam( id_exam ),
  })
}

export const useQuestions = ( id_exam: string ) => {
  return useQuery<Question[]>({
    queryKey: ["questions", id_exam],
    queryFn: () => getQuestionsExam( id_exam ),
  })
}