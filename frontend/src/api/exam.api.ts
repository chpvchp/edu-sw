import type { Exam } from "../type/exam.type";
import { api } from "./api"

export const getExam = async (): Promise<Exam[]> => {
  const { data } = await api.get("/backend-api/bai-tap");
  return data;
}