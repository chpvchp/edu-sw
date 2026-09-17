import { useParams } from "react-router-dom"
import { useCards, useInfoFlashcard } from "../hooks/useFlashCard";
import FlashCard from "../components/FlashCard";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function DoFlashCardPage () {

  const { id_flashcard } = useParams();
  const idFlashcard = String(id_flashcard)
  const { data, isLoading, isError } = useCards(idFlashcard);
  const [ order, setOrder] = useState(0);
  const { data: flashcardInfo} = useInfoFlashcard(idFlashcard)

  if (!flashcardInfo) {
    return (
      <p className="p-4 mx-auto">Không thấy thông tin</p>
    )
  }

  const disableButtonBack = order === 0
  const disableButtonContinue = order === flashcardInfo.num_cards - 1

  // console.log(data)
  // console.log("order: ", order)

  if (isLoading) return <p className="p-4 mx-auto">Đang tải đề...</p>
  if (isError) return <p className="p-4 mx-auto">Máy chủ lỗi!</p>

  function continueCard(order: number) {
    setOrder(order + 1)
  }
  function backCard(order: number) {
    setOrder(order - 1)
  }

  const card = data?.[order]

  if (!card) {
    return <p className="p-4 mx-auto">Không tìm thấy thẻ!</p>
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl flex-1 py-10">
      <div className="flex flex-col gap-8">


        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#a85c18]">Đang ôn tập</p><h1 className="mt-2 text-2xl font-extrabold text-[#18324b]">{flashcardInfo.name_flashcard}</h1><p className="mt-1 text-sm text-[#6c8494]">{flashcardInfo.language}</p></div>
          <p className="text-sm font-bold text-[#587084]">{order + 1} / {flashcardInfo.num_cards}</p>
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          <FlashCard 
            key={card?.order}
            order={card?.order}
            audio={card?.audio}
            vocab={card?.vocab}
            pos={card?.pos}
            ipa={card?.ipa}
            mean={card?.mean}
            example={card?.example}
          />
          <div className="h-2 w-full max-w-lg overflow-hidden rounded-full bg-[#e8eff3]"><div className="h-full rounded-full bg-[#e5a45d] transition-all" style={{ width: `${(order + 1) / flashcardInfo.num_cards * 100}%` }} /></div>
          <div className="flex items-center gap-8">
            <button 
              aria-label="Thẻ trước"
              className={`rounded-xl p-3 text-white shadow-lg transition duration-200 ${ disableButtonBack ? "bg-[#b9c7ce]" : "bg-[#18324b] hover:-translate-y-0.5"}`}
              onClick={() => backCard(order)}
              disabled={disableButtonBack}
            >
              <ArrowLeft />
            </button>
            <div className="flex items-center justify-center text-sm font-bold text-[#587084]">
              <p>{order + 1}</p>
              <p>/</p>
              <p>{flashcardInfo.num_cards}</p>
            </div>
            <button 
              aria-label="Thẻ tiếp theo"
              className={`rounded-xl p-3 text-white shadow-lg transition duration-200 ${ disableButtonContinue ? "bg-[#b9c7ce]" : "bg-[#18324b] hover:-translate-y-0.5"}`}
              onClick={() => continueCard(order)}
              disabled={disableButtonContinue}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

    </main>
  )
}