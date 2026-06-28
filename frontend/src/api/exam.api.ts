import type { Exam } from "../type/exam.type";
import type { InfoExam } from "../type/infoexam.type";
import { api } from "./api"

export const getExam = async (): Promise<Exam[]> => {
  const { data } = await api.get("/backend-api/bai-tap");
  return data;
}

export const getInfoExam = async ( id_exam: string): Promise<InfoExam> => {
  const { data } = await api.get(`/backend-api/bai-tap/${id_exam}`);
  return data;
}

export const getQuestionsExam = async ( id_exam: string) => {
  const { data } = await api.get(`/backend-api/bai-tap/${id_exam}/questions`);
  return data
}