import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInfoExam } from "../hook/useExam";
import CardInfoExam from "../components/CardInfoExam";

/**
 * InfoExamPage | trang thông tin đề.
 * Resolves the current exam id from the route and renders the exam summary card before the learner starts practicing.
 * Lấy id đề hiện tại từ route và hiển thị thẻ tóm tắt đề trước khi người học bắt đầu làm bài.
 */
export default function InfoExamPage() {
  const { id_exam } = useParams();
  const idExam = String(id_exam)
  const { data } = useInfoExam( idExam );

  useEffect(() => {
    if (data?.name_exam) {
      document.title = `${data.name_exam} | Edu SW`;
    } else {
      document.title = "Đang tải... | Edu SW";
    }
  }, [data?.name_exam]);

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto">
      <CardInfoExam
        data={data}
      />
    </main>
  )
}