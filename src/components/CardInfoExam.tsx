import { Link } from "react-router-dom"
import type { InfoExam } from "../type/infoexam.type"
import { ConvertDate } from "../hooks/useConvert"
import { ArrowRight, Download, Clock3, GraduationCap } from "lucide-react"

type CardInfoExamProps = {
  data?: InfoExam
}

/**
 * CardInfoExam | thẻ thông tin đề.
 * Shows the selected exam metadata and exposes the entry point to start the practice session.
 * Hiển thị thông tin cơ bản của đề đã chọn và cung cấp nút để bắt đầu làm bài.
 */
export default function CardInfoExam({ data }: CardInfoExamProps) {

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#dbe7ee] bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#27735f]"><GraduationCap className="h-4 w-4" aria-hidden="true" />Thông tin bài tập</div>
      <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#18324b] sm:text-3xl">{data?.name_exam}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#e9f7f0] p-4"><p className="text-xs text-[#6c8494]">Môn học</p><p className="mt-1 font-bold text-[#27735f]">{data?.name_subject}</p></div>
        <div className="rounded-xl bg-[#f7fafc] p-4"><p className="text-xs text-[#6c8494]">Lớp</p><p className="mt-1 font-bold text-[#18324b]">{data?.class_exam}</p></div>
        <div className="rounded-xl bg-[#fff1df] p-4"><p className="text-xs text-[#6c8494]">Thời lượng</p><p className="mt-1 inline-flex items-center gap-1 font-bold text-[#a85c18]"><Clock3 className="h-4 w-4" aria-hidden="true" />{data?.duration} phút</p></div>
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-[#edf2f5] pt-5 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-[#6c8494]">Cập nhật {ConvertDate(data?.updated ?? "")}</p><a className="inline-flex items-center gap-2 font-bold text-[#27735f] hover:underline" href={data?.source} download><Download className="h-4 w-4" aria-hidden="true" />Tải tài liệu</a></div>
      <Link to={`/bai-tap/${data?.id_exam}/lam-bai`} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#18324b] p-3.5 text-sm font-bold text-white transition hover:bg-[#264d6b]">Bắt đầu làm bài<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
  )
}