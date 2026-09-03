// import FlashCard from "../components/FlashCard"

import { useEffect } from "react";
import { useListFlashCard } from "../hooks/useFlashCard"
import CardFlashCard from "../components/CardFlashCard";
import type { FlashCard } from "../type/flashcard.type";

export default function FlashCardPage() {

  const { data, isLoading, error } = useListFlashCard();


  useEffect(() => {
    document.title = "Flashcard | Edu SW"
  }, [])

  if (isLoading) return <p className="p-4 mx-auto">Đang lấy danh sách bài tập...</p>;
  if (error) return <p className="p-4 mx-auto">Máy chủ lỗi!</p>;


  console.log(data)

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto">
      <div className="flex justify-center">
        <p className="p-4 italic">Chọn các flashcard bên dưới để rèn luyện nhé :3</p>
      </div>

      <div className="p-2 flex flex-col lg:grid lg:grid-cols-4 justify-center gap-2 lg:gap-6 lg:mx-auto">

        {data?.map((card: FlashCard) => (
          <CardFlashCard
            key={card?.id_flashcard}
            id_flashcard={card?.id_flashcard}
            name_flashcard={card?.name_flashcard}
            language={card?.language}
            num_cards={card?.num_cards}
            updated={card?.updated}
            created={card?.created}
            source={card?.source}
          />
        ))}
        

      </div>

      {/* <FlashCard 
        vocab={data?.vocab}
        pos={data?.pos}
        ipa={data?.ipa}
        mean={data?.mean}
        example={data?.example}
      /> */}

    </main>
  )
}