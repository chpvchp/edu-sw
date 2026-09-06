import { useEffect, useState } from "react";
import CardExam from "../components/CardExam";
import { useListExam } from "../hooks/useExam";
import type { Exam } from "../type/exam.type";

export default function BaiTapPage() {
  const { data, isLoading, error } = useListExam();

  const [subject, setSubject] = useState("all");
  const [classExam, setClassExam] = useState("all");

  useEffect(() => {
    document.title = "Bài Tập | Edu SW";
  }, []);

  if (isLoading) {
    return <p className="p-4 mx-auto">Đang lấy danh sách bài tập...</p>;
  }

  if (error) {
    return <p className="p-4 mx-auto">Máy chủ lỗi!</p>;
  }

  const filteredExams = data
    ?.filter((exam: Exam) => {
      const matchSubject =
        subject === "all" ||
        exam.name_subject === subject;

      const matchClass =
        classExam === "all" ||
        exam.class_exam === classExam;

      return matchSubject && matchClass;
    })
    .sort(
      (a, b) =>
        new Date(b.updated).getTime() -
        new Date(a.updated).getTime()
    );

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto">

      <div className="flex justify-center">
        <p className="p-4 italic">
          Chọn các bài tập bên dưới để rèn luyện nhé :3
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="p-2 mb-4 flex flex-wrap gap-4">

        {/* Môn học */}
        <div className="flex flex-col gap-2">
          <label>Môn học:</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-2 border border-gray-400 rounded-lg"
          >
            <option value="all">Tất cả</option>
            <option value="Toán">Toán</option>
            <option value="Vật lý">Vật lý</option>
            <option value="Hóa học">Hóa học</option>
          </select>
        </div>

        {/* Lớp */}
        <div className="flex flex-col gap-2">
          <label>Lớp:</label>

          <select
            value={classExam}
            onChange={(e) => setClassExam(e.target.value)}
            className="p-2 border border-gray-400 rounded-lg"
          >
            <option value="all">Tất cả</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
        </div>

      </div>

      {/* Danh sách */}
      <div className="p-2 flex flex-col lg:grid lg:grid-cols-4 justify-center gap-2 lg:gap-6 lg:mx-auto">

        {filteredExams?.map((exam: Exam) => (
          <CardExam
            key={exam.id_exam}
            id_exam={exam.id_exam}
            name_exam={exam.name_exam}
            class_exam={exam.class_exam}
            name_subject={exam.name_subject}
            duration={exam.duration}
            updated={exam.updated}
            created={exam.created}
          />
        ))}

      </div>

    </main>
  );
}