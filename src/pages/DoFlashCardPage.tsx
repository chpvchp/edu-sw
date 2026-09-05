import { useParams } from "react-router-dom"
import { useCards, useInfoFlashcard } from "../hooks/useFlashCard";
import FlashCard from "../components/FlashCard";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import CardFlashCard from "../components/CardFlashCard";

export default function DoFlashCardPage () {

  const { id_flashcard } = useParams();
  const idFlashcard = String(id_flashcard)
  const { data, isLoading, isError } = useCards(idFlashcard);
  const [ order, setOrder] = useState(0);
  const { data: flashcardInfo} = useInfoFlashcard(idFlashcard)

  console.log(flashcardInfo)

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
    <main className="min-h-screen flex-1">
      <div className="flex flex-col gap-8">


        <div className="mt-8 mx-auto">
          <CardFlashCard
            key={flashcardInfo?.id_flashcard}
            id_flashcard={flashcardInfo?.id_flashcard}
            name_flashcard={flashcardInfo?.name_flashcard}
            language={flashcardInfo?.language}
            num_cards={flashcardInfo?.num_cards}
            updated={flashcardInfo?.updated}
            created={flashcardInfo?.created}
            source={flashcardInfo?.source}
          />
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
              className={`p-2 text-white rounded-xl shadow-lg transition duration-200 ${ disableButtonBack ? "bg-gray-400" : "bg-blue-600 hover:scale-110"}`}
              onClick={() => backCard(order)}
              disabled={disableButtonBack}
            >
              <ArrowLeft />
            </button>
            <div className="flex justify-center items-center text-gray-600">
              <p>{order + 1}</p>
              <p>/</p>
              <p>2</p>
            </div>
            <button 
              className={`p-2 text-white rounded-xl shadow-lg transition duration-200 ${ disableButtonContinue ? "bg-gray-400" : "bg-blue-600 hover:scale-110"}`}
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