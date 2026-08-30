import { Link } from "react-router-dom";
import { BookOpen, Target, Trophy, ArrowRight } from "lucide-react";
import { useListExam } from "../hooks/useExam";

/**
 * HomePage | trang chủ.
 * Acts as the landing page and gently directs the learner toward the practice list without duplicating the exam flow.
 * Đóng vai trò trang chào đầu và dẫn người học tới danh sách bài tập mà không lặp lại luồng luyện đề.
 */
export default function HomePage() {
  const { data } = useListExam();

  const subjectCount = new Set(data?.map((e) => e.name_subject)).size;
  const classCount = new Set(data?.map((e) => e.class_exam)).size;

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto flex flex-col">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 gap-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Chào mừng đến với EduSW :D
          </h1>
        </div>

        <p className="max-w-xl text-gray-600 leading-relaxed">
          Trang web miễn phí, giúp các bạn ôn tập và kiểm tra kiến thức mỗi ngày qua các bài tập tổng hợp :^
        </p>

        <Link
          to="/bai-tap"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full
                     shadow-md hover:bg-blue-800 hover:shadow-lg transition duration-300 hover:scale-110"
        >
          Bắt đầu luyện tập :D
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Hãy cùng nhau luyện tập nào, cố gắng đạt kết quả tốt nhá ;3
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Đề thi đa dạng</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hỗ trợ nhiều môn học, lớp với dạng câu hỏi trắc nghiệm, đúng/sai và trả lời ngắn, có ảnh đầy đủ.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Chấm điểm tự động</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nộp bài và nhận kết quả ngay lập tức — biết được mình đúng bao nhiêu, sai bao nhiêu và câu nào chưa làm.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Theo dõi tiến độ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Xem lại kết quả của đề, học từ sai lầm và cải thiện điểm số theo thời gian.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      {data && data.length > 0 && (
        <section className="px-4 pb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Thông tin bài tập hiện tại
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-6 text-center border border-gray-200 rounded-xl bg-blue-50">
              <p className="text-3xl font-extrabold text-blue-600">{data.length}</p>
              <p className="text-gray-600 text-sm mt-1">Đề thi</p>
            </div>

            <div className="p-6 text-center border border-gray-200 rounded-xl bg-green-50">
              <p className="text-3xl font-extrabold text-green-600">{subjectCount}</p>
              <p className="text-gray-600 text-sm mt-1">Môn học</p>
            </div>

            <div className="p-6 text-center border border-gray-200 rounded-xl bg-purple-50">
              <p className="text-3xl font-extrabold text-purple-600">{classCount}</p>
              <p className="text-gray-600 text-sm mt-1">Lớp</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Limitations ──────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-xl mx-auto p-6 border border-yellow-300 rounded-xl bg-yellow-50">
          <h2 className="text-xl font-bold text-yellow-800 mb-3">
            ⚠️ Hạn chế & Đang phát triển
          </h2>

          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Web chưa hỗ trợ dạng bài tập Tiếng Anh và chỉ có bài tập lớp 12.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Hiện tại chưa có bài tập, các bài tập sẽ được thêm trong thời gian nhanh nhất.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Chưa có tính năng đăng nhập, lưu trữ kết quả cá nhân hay thống kê dài hạn.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600 font-bold">•</span>
              <span>Giao diện và tính năng sẽ còn được cải thiện — mong các bạn thông cảm và góp ý nhé :3</span>
            </li>
          </ul>
        </div>
      </section>


      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="px-4 pb-8 pt-4 text-center border-t border-gray-200 mt-auto">
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-sm font-medium text-gray-700">
            Thông tin liên hệ
          </p>
          {/* Facebook */}
          <div className="flex">
            <a href="https://www.facebook.com/hoang.phuc.494074/" className="p-2">
              <img
                src="/icons/facebook-1.svg"
                className="h-8 w-8"
              />
            </a>
            {/* Tiktok */}
            <a href="https://www.tiktok.com/@caohoangphuc1203" className="p-2">
              <img
                src="/icons/tiktok-logo.svg"
                className="h-8 w-8"
              />
            </a>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          <p className="italic">"Học thì phải đi đôi với hành!"</p>
        </p>
        <p className="mt-2 text-xs text-gray-400">
          © 2026 EduSW — Đươc xây dựng bằng React/Vite và Tailwind CSS.
        </p>
      </footer>

    </main>
  );
}
