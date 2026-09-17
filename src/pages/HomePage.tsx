import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, Trophy } from "lucide-react";
import { useListExam } from "../hooks/useExam";

/**
 * HomePage | trang chủ.
 * Acts as the landing page and gently directs the learner toward the practice list without duplicating the exam flow.
 * Đóng vai trò trang chào đầu và dẫn người học tới danh sách bài tập mà không lặp lại luồng luyện đề.
 */
export default function HomePage() {
  const { data } = useListExam();

  const subjectCount = new Set(data?.map((e) => e.name_subject)).size;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-1 flex-col">
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c8e8dc] bg-[#e9f7f0] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#27735f]">
            <Target className="h-4 w-4" aria-hidden="true" />
            Học chủ động mỗi ngày
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#18324b] sm:text-5xl lg:text-6xl">
            Học chắc hơn, tiến bộ rõ hơn.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#587084] sm:text-lg">
            EduSW giúp bạn luyện đề, xem lại lỗi sai và ghi nhớ từ vựng trong một không gian học tập gọn gàng, tập trung.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/bai-tap" className="inline-flex items-center gap-2 rounded-xl bg-[#18324b] px-5 py-3 font-bold text-white shadow-lg shadow-[#18324b]/15 transition hover:-translate-y-0.5 hover:bg-[#264d6b]">
              Bắt đầu luyện tập
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-[#18324b] p-7 text-white shadow-2xl shadow-[#18324b]/20 sm:p-9">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[24px] border-[#8ed5bd]/25" />
          <BookOpen className="relative h-10 w-10 text-[#a9e5cf]" aria-hidden="true" />
          <p className="relative mt-14 text-sm font-semibold uppercase tracking-[0.14em] text-[#a9e5cf]">Không gian học tập</p>
          <p className="relative mt-3 text-2xl font-bold leading-snug">Mỗi lần luyện tập là một bước tiến gần hơn tới mục tiêu.</p>
          <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-5">
            <div><p className="text-2xl font-extrabold">{data?.length ?? 0}</p><p className="text-xs text-white/65">bài tập</p></div>
            <div><p className="text-2xl font-extrabold">{subjectCount}</p><p className="text-xs text-white/65">môn học</p></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 border-y border-[#dbe7ee] py-5 sm:grid-cols-4 sm:gap-6">
        {[{value: data?.length ?? 0, label: "Đề thi"}, {value: subjectCount, label: "Môn học"}].map(({value, label}) => (
          <div key={label} className="px-2 sm:px-4">
            <p className="text-2xl font-extrabold text-[#18324b]">{value}</p>
            <p className="mt-1 text-sm text-[#6c8494]">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 py-14 md:grid-cols-3">
        {[{icon: BookOpen, title: "Luyện đề đa dạng", text: "Làm quen nhiều môn học và dạng câu hỏi trong kho bài tập được sắp xếp rõ ràng."}, {icon: Target, title: "Biết mình đang ở đâu", text: "Nhận kết quả ngay sau khi nộp bài, xem lại từng câu và hiểu chính xác lỗi sai."}, {icon: Trophy, title: "Tạo nhịp học bền vững", text: "Duy trì thói quen học tập mỗi ngày và theo dõi tiến bộ qua từng lần luyện đề."}].map(({icon: Icon, title, text}) => (
          <article key={title} className="rounded-2xl border border-[#dbe7ee] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#18324b]/8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f7f0] text-[#27735f]"><Icon className="h-5 w-5" aria-hidden="true" /></div>
            <h2 className="mt-5 text-lg font-bold text-[#18324b]">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-[#6c8494]">{text}</p>
          </article>
        ))}
      </section>


      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#dbe7ee] px-4 pb-8 pt-8 text-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-sm font-bold text-[#18324b]">
            Thông tin liên hệ
          </p>
          {/* Facebook */}
          <div className="flex">
            <a aria-label="Facebook EduSW" href="https://www.facebook.com/hoang.phuc.494074/" className="p-2 transition duration-300 hover:-translate-y-1">
              <img
                src="/icons/facebook-1.svg"
                alt=""
                className="h-7 w-7"
              />
            </a>
            {/* Tiktok */}
            <a aria-label="TikTok EduSW" href="https://www.tiktok.com/@caohoangphuc1203" className="p-2 transition duration-300 hover:-translate-y-1">
              <img
                src="/icons/tiktok-logo.svg"
                alt=""
                className="h-7 w-7"
              />
            </a>
            {/* GitHub */}
            <a aria-label="GitHub EduSW" href="https://github.com/chpvchp" className="p-2 transition duration-300 hover:-translate-y-1">
              <img
                src="/icons/github.svg"
                alt=""
                className="h-7 w-7"
              />
            </a>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#6c8494]">
          <span className="italic">"Học thì phải đi đôi với hành."</span>
        </p>
        <p className="mt-2 text-xs text-[#91a5b1]">
          © 2026 EduSW · React, Vite và Tailwind CSS.
        </p>
      </footer>

    </main>
  );
}
