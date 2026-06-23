import { useQuery } from "@tanstack/react-query"
import type { Exam } from "../type/exam.type"
import { getExam } from "../api/exam.api"

export const useListExam = () => {
  return useQuery<Exam[]>({
    queryKey: ["list-exams"],
    queryFn: getExam,
  });
};