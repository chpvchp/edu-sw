import { useEffect } from "react";
import CardExam from "../components/CardExam";
import { useListExam } from "../hook/useExam";
import type { Exam } from "../type/exam.type";

/**
 * BaiTapPage | trang danh sách bài tập.
 * Presents the available practice exams and lets the learner choose one exam card to inspect or start.
 * Hiển thị các đề luyện tập khả dụng và cho người học chọn một thẻ bài tập để xem chi tiết hoặc bắt đầu làm bài.
 */
export default function BaiTapPage() {

  const { data, isLoading, error } = useListExam();

  useEffect(() => {
    document.title = "Bài Tập | Edu SW"
  }, [])

  if (isLoading) return <p className="p-4 mx-auto">Đang lấy danh sách bài tập...</p>;
  if (error) return <p className="p-4 mx-auto">Máy chủ lỗi!</p>;

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto">

      <div className="flex justify-center">
        <p className="p-4 italic">Chọn các bài tập bên dưới để rèn luyện nhé:3</p>
      </div>

      <div className="p-2 flex flex-col lg:grid lg:grid-cols-4 justify-center gap-2 lg:gap-6 lg:mx-auto">

        {data?.map((exam: Exam) => (
          <CardExam
            key={exam.id_exam}
            id_exam={exam.id_exam}
            name_exam={exam.name_exam}
            name_subject={exam.name_subject}
            duration={exam.duration}
            updated={exam.updated}
            created={exam.created}
          />
        ))}

      </div>

    </main>
  )
}