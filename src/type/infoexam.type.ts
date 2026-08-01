export type InfoExam = {
  id_exam: string;
  id_subject?: string | number;
  name_exam: string;
  name_subject: string;
  duration: number;
  created: string;
}

/**
 * InfoExam | kiểu thông tin đề.
 * Carries the metadata shown on the exam detail screen before the learner enters the working view.
 * Chứa metadata hiển thị ở trang chi tiết đề trước khi người học đi vào màn hình làm bài.
 */