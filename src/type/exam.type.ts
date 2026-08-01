export type Exam = {
  id_exam: string;
  id_subject?: string | number;
  name_exam: string;
  name_subject: string;
  duration: number;
  created: string;
}

/**
 * Exam | kiểu bài tập.
 * Describes the compact exam metadata used by the practice list card and any place that only needs a high-level exam summary.
 * Mô tả metadata rút gọn của bài tập, dùng cho thẻ danh sách và những nơi chỉ cần thông tin tổng quan của đề.
 */