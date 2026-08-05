import type { Exam } from "../type/exam.type";
import type { InfoExam } from "../type/infoexam.type";
import type { Question } from "../type/question.type";
import type { QuestionResult } from "../type/question-answer.type";
import type { SubmitQuestionAnswer, SubmitQuestionAnswerResponse } from "../type/submit.type";

type ExamData = InfoExam & {
  questions: Question[];
};

const EXAMS_INDEX_PATH = "/data/exams/index.json";
const examCache = new Map<string, ExamData>();

/**
 * fetchJson | tải JSON.
 * Reads a JSON asset from public space and converts it into the requested type, so the app can work without any backend service.
 * Đọc một file JSON từ thư mục public và ép về kiểu dữ liệu mong muốn, giúp ứng dụng hoạt động hoàn toàn không cần backend.
 */
async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu: ${path}`);
  }

  return response.json() as Promise<T>;
}

/**
 * loadExamData | tải dữ liệu đề.
 * Loads one exam payload by id, memoizes it in memory, and reuses it across the current session to avoid repeated network reads.
 * Nạp một bộ đề theo id, lưu tạm vào bộ nhớ trong phiên làm việc và tái sử dụng lại để tránh đọc file nhiều lần.
 */
async function loadExamData(idExam: string): Promise<ExamData> {
  const cachedExam = examCache.get(idExam);

  if (cachedExam) {
    return cachedExam;
  }

  const exam = await fetchJson<ExamData>(`/data/exams/${idExam}.json`);
  examCache.set(idExam, exam);
  return exam;
}

/**
 * buildCorrectResults | dựng kết quả đúng.
 * Transforms the exam question list into the structure used by the result screen, keeping each question's canonical answer data in one place.
 * Chuyển danh sách câu hỏi của đề sang cấu trúc phục vụ màn hình kết quả, để toàn bộ đáp án chuẩn của từng câu nằm ở một nơi duy nhất.
 */
function buildCorrectResults(questions: Question[]) {
  return questions.reduce<SubmitQuestionAnswerResponse["correct_results"]>((accumulator, question) => {
    accumulator[question.id_question] = {
      type: question.type_question,
      results: question.results,
    };

    return accumulator;
  }, {});
}

/**
 * calculateScore | tính điểm.
 * Compares the student's submitted answers against the exam key, computes score and counters, and returns the full result payload used by the UI.
 * So sánh đáp án người học với đáp án chuẩn của đề, tính điểm cùng các thống kê liên quan, rồi trả về toàn bộ payload kết quả cho giao diện.
 */
function calculateScore(exam: ExamData, studentResults: Record<string, QuestionResult>): SubmitQuestionAnswerResponse {
  const correctResults = buildCorrectResults(exam.questions);
  const totalQuestions = exam.questions.length;
  const scorePerQuestion = totalQuestions > 0 ? 10 / totalQuestions : 0;

  let score = 0;
  let numCorrect = 0;
  let numWrong = 0;

  for (const question of exam.questions) {
    const studentResult = studentResults[question.id_question];

    if (!studentResult) {
      continue;
    }

    if (question.type_question === "four_choice") {
      if (studentResult.type === "four_choice" && studentResult.answer === question.results.correct_answer) {
        score += scorePerQuestion;
        numCorrect += 1;
      } else {
        numWrong += 1;
      }

      continue;
    }

    if (question.type_question === "true_false") {
      let percentAnswerCorrect = 0;
      let questionIsCorrect = true;

      if (studentResult.type === "true_false") {
        for (const trueAnswer of studentResult.true_answer) {
          if (question.results.true_answer.includes(trueAnswer)) {
            percentAnswerCorrect += 1;
          } else {
            questionIsCorrect = false;
          }
        }

        for (const falseAnswer of studentResult.false_answer) {
          if (question.results.false_answer.includes(falseAnswer)) {
            percentAnswerCorrect += 1;
          } else {
            questionIsCorrect = false;
          }
        }
      } else {
        questionIsCorrect = false;
      }

      if (percentAnswerCorrect === 1) {
        score += scorePerQuestion * 0.1
      } else if (percentAnswerCorrect === 2) {
        score += scorePerQuestion * 0.25
      } else if (percentAnswerCorrect === 3) {
        score += scorePerQuestion * 0.5
      } else if (percentAnswerCorrect === 4) {
        score += scorePerQuestion
      }

      if (questionIsCorrect) {
        numCorrect += 1;
      } else {
        numWrong += 1;
      }

      continue;
    }

    if (question.type_question === "short_answer") {
      if (studentResult.type === "short_answer" && Number(studentResult.answer) === Number(question.results.short_answer)) {
        score += scorePerQuestion;
        numCorrect += 1;
      } else {
        numWrong += 1;
      }
    }
  }

  const numNone = totalQuestions - (numCorrect + numWrong);

  return {
    score,
    name_exam: exam.name_exam,
    subject: exam.name_subject,
    num_correct: numCorrect,
    num_wrong: numWrong,
    num_none: numNone,
    duration: exam.duration,
    student_duration: "N/A",
    updated: exam.updated, 
    created: exam.created,
    questions: exam.questions,
    correct_results: correctResults,
    student_results: studentResults,
  };
}

/**
 * getExam | lấy danh sách bài tập.
 * Returns the exam index that drives the practice list page.
 * Trả về danh sách bài tập để trang luyện đề hiển thị.
 */
export const getExam = async (): Promise<Exam[]> => fetchJson<Exam[]>(EXAMS_INDEX_PATH);

/**
 * getInfoExam | lấy thông tin đề.
 * Returns only the metadata needed by the exam info card and detail page, without loading the full question list into the caller.
 * Chỉ trả về phần metadata cần cho thẻ thông tin và trang chi tiết, không đẩy toàn bộ danh sách câu hỏi ra ngoài.
 */
export const getInfoExam = async (idExam: string): Promise<InfoExam> => {
  const { questions: _questions, ...infoExam } = await loadExamData(idExam);
  return infoExam;
};

/**
 * getQuestionsExam | lấy câu hỏi của đề.
 * Returns the question array for the active exam so the practice screen can render each item in order.
 * Trả về mảng câu hỏi của đề hiện tại để màn hình làm bài hiển thị lần lượt từng câu.
 */
export const getQuestionsExam = async (idExam: string): Promise<Question[]> => {
  const exam = await loadExamData(idExam);
  return exam.questions;
};

/**
 * postQuestionAnswer | nộp đáp án.
 * Keeps the old mutation shape but evaluates everything locally, so submitting answers still feels like a request while remaining static-site friendly.
 * Giữ nguyên hình thức mutation cũ nhưng chấm bài hoàn toàn ở phía client, nên thao tác nộp bài vẫn giống gọi API dù ứng dụng đã chuyển sang static.
 */
export const postQuestionAnswer = async (studentSubmit: SubmitQuestionAnswer): Promise<SubmitQuestionAnswerResponse> => {
  const exam = await loadExamData(studentSubmit.id_exam);
  return calculateScore(exam, studentSubmit.results);
};