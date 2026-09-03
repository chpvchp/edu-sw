import { useParams } from "react-router-dom"
import { useCards } from "../hooks/useFlashCard";
import FlashCard from "../components/FlashCard";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function DoFlashCardPage () {

  const { id_flashcard } = useParams();
  const idFlashcard = String(id_flashcard)
  const { data, isLoading, isError } = useCards(idFlashcard);
  const [ order, setOrder] = useState(0);

  console.log(data)

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
    <main className="min-h-screen flex-1">
      <div className="flex flex-col">

        <div className="p-5">

        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          <FlashCard 
            order={card?.order}
            vocab={card?.vocab}
            pos={card?.pos}
            ipa={card?.ipa}
            mean={card?.mean}
            example={card?.example}
          />
          <div className="p-2 flex gap-8">
            <button 
              className="p-2 bg-blue-600 text-white rounded-xl shadow-lg transition duration-200 hover:scale-110"
              onClick={() => backCard(order)}
            >
              <ArrowLeft />
            </button>
            <div className="flex justify-center items-center text-gray-600">
              <p>{order + 1}</p>
              <p>/</p>
              <p>2</p>
            </div>
            <button 
              className="p-2 bg-blue-600 text-white rounded-xl shadow-lg transition duration-200 hover:scale-110"
              onClick={() => continueCard(order)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

    </main>
  )
}