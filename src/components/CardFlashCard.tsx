import type { FlashCard } from "../type/flashcard.type"
import { ConvertDate } from "../hooks/useConvert"
import { Link } from "react-router-dom"
import { ArrowUpRight, Layers3 } from "lucide-react"


export default function CardFlashCard ({ id_flashcard, name_flashcard, language, num_cards, updated } : FlashCard) {
  return (
    <Link to={`/flashcard/${id_flashcard}/practice`} className="group flex min-h-52 flex-col justify-between rounded-2xl border border-[#dbe7ee] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#a8d8c5] hover:shadow-lg hover:shadow-[#18324b]/8">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1df] px-2.5 py-1 text-xs font-bold text-[#a85c18]"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" />{language}</span>
        <ArrowUpRight className="h-5 w-5 text-[#9ab0bc] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#27735f]" aria-hidden="true" />
      </div>
      <h2 className="mt-5 line-clamp-2 text-lg font-bold leading-snug text-[#18324b]">{name_flashcard}</h2>
      <div className="mt-6 flex items-end justify-between border-t border-[#edf2f5] pt-4">
        <div><p className="text-2xl font-extrabold text-[#18324b]">{num_cards}</p><p className="text-xs text-[#6c8494]">thẻ từ vựng</p></div>
        <p className="text-right text-xs text-[#91a5b1]">Cập nhật<br />{ConvertDate(updated)}</p>
      </div>
    </Link>
  )
}