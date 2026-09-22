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
        Number(exam.class_exam) === Number(classExam);

      return matchSubject && matchClass;
    })
    .sort(
      (a, b) =>
        new Date(b.updated).getTime() -
        new Date(a.updated).getTime()
    );

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl flex-1 py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#27735f]">Kho học tập</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18324b]">Bài tập</h1>
          <p className="mt-2 text-sm text-[#6c8494]">Chọn một đề để luyện tập và kiểm tra kiến thức.</p>
        </div>
        <p className="text-sm font-semibold text-[#587084]">{filteredExams?.length ?? 0} bài tập</p>
      </div>

      <div className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-[#dbe7ee] bg-white p-4 shadow-sm">

        {/* Môn học */}
        <div className="flex min-w-40 flex-1 flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-[#6c8494]">Môn học</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-[#cbdde6] bg-[#f7fafc] p-2.5 text-sm text-[#18324b]"
          >
            <option value="all">Tất cả</option>
            <option value="Toán">Toán</option>
            <option value="Vật lý">Vật lý</option>
            <option value="Hóa">Hóa học</option>
            <option value="Lịch Sử">Lịch Sử</option>
          </select>
        </div>

        {/* Lớp */}
        <div className="flex min-w-40 flex-1 flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-[#6c8494]">Lớp</label>

          <select
            value={classExam}
            onChange={(e) => setClassExam(e.target.value)}
            className="rounded-xl border border-[#cbdde6] bg-[#f7fafc] p-2.5 text-sm text-[#18324b]"
          >
            <option value="all">Tất cả</option>
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </select>
        </div>

      </div>

      {/* Danh sách */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
          {filteredExams?.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[#b9cfd9] bg-white px-6 py-14 text-center">
              <p className="font-bold text-[#18324b]">Không tìm thấy bài tập phù hợp</p>
              <p className="mt-2 text-sm text-[#6c8494]">Thử thay đổi bộ lọc để xem thêm nội dung.</p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}