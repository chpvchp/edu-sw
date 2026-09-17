import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react"
import { Link } from "react-router-dom"
import type { InfoExam } from "../type/infoexam.type"
import { ConvertDate } from "../hooks/useConvert"

/**
 * CardExam | thẻ bài tập.
 * Renders a compact exam summary card in the practice list, including subject, duration, and creation time.
 * Hiển thị thẻ tóm tắt bài tập trong danh sách luyện đề, gồm môn học, thời lượng và thời điểm tạo.
 */
export default function CardExam({ id_exam, name_subject, name_exam, class_exam, duration, updated }: InfoExam) {

  return (
    <Link to={`/bai-tap/${id_exam}`} className="group flex min-h-56 flex-col justify-between rounded-2xl border border-[#dbe7ee] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#a8d8c5] hover:shadow-lg hover:shadow-[#18324b]/8">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f7f0] px-2.5 py-1 text-xs font-bold text-[#27735f]">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {name_subject}
          </span>
          <ArrowUpRight className="h-5 w-5 text-[#9ab0bc] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#27735f]" aria-hidden="true" />
        </div>
        <h2 className="mt-5 line-clamp-2 text-lg font-bold leading-snug text-[#18324b]">{name_exam}</h2>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[#edf2f5] pt-4 text-xs font-semibold text-[#6c8494]">
        <span>Lớp {class_exam}</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{duration} phút</span>
      </div>
      <p className="mt-3 text-xs text-[#91a5b1]">Cập nhật {ConvertDate(updated)}</p>
    </Link>
  )
}