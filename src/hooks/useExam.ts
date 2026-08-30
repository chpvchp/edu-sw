import { useEffect, useState } from "react"
import type { Exam } from "../type/exam.type"
import { getExam, getInfoExam, getQuestionsExam } from "../api/exam.api"
import type { InfoExam } from "../type/infoexam.type";
import type { Question } from "../type/question.type";

/**
 * useListExam | hook lấy danh sách bài tập.
 * Loads the exam index once on mount and exposes loading/error state for the practice list page.
 * Tải danh sách đề một lần khi component mount và trả về trạng thái loading/lỗi cho trang danh sách luyện đề.
 */
export const useListExam = () => {
  const [data, setData] = useState<Exam[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    getExam()
      .then((examList) => {
        if (isMounted) {
          setData(examList);
          setError(null);
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};

/**
 * useInfoExam | hook lấy thông tin đề.
 * Fetches the metadata for a single exam id and keeps the exam detail view isolated from the full question payload.
 * Lấy metadata của một đề theo id và giữ trang chi tiết tách biệt khỏi toàn bộ dữ liệu câu hỏi.
 */
export const useInfoExam = ( id_exam: string ) => {
  const [data, setData] = useState<InfoExam | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setIsError(false);

    getInfoExam(id_exam)
      .then((infoExam) => {
        if (isMounted) {
          setData(infoExam);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id_exam]);

  return { data, isLoading, isError };
}

/**
 * useQuestions | hook lấy danh sách câu hỏi.
 * Fetches the question set for the current exam so the practice screen can render the working form and answer navigator.
 * Lấy bộ câu hỏi của đề hiện tại để màn hình làm bài hiển thị form trả lời và bảng điều hướng câu hỏi.
 */
export const useQuestions = ( id_exam: string ) => {
  const [data, setData] = useState<Question[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setIsError(false);

    getQuestionsExam(id_exam)
      .then((questions) => {
        if (isMounted) {
          setData(questions);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id_exam]);

  return { data, isLoading, isError };
}