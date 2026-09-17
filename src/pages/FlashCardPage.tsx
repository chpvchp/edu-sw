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
    <main className="mx-auto min-h-screen w-full max-w-7xl flex-1 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#a85c18]">Ghi nhớ thông minh</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#18324b]">Flashcard</h1><p className="mt-2 text-sm text-[#6c8494]">Ôn lại từ vựng theo nhịp học của riêng bạn.</p></div>
        <p className="text-sm font-semibold text-[#587084]">{data?.length ?? 0} bộ thẻ</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
        {data?.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-[#b9cfd9] bg-white px-6 py-14 text-center"><p className="font-bold text-[#18324b]">Chưa có bộ flashcard</p><p className="mt-2 text-sm text-[#6c8494]">Nội dung mới sẽ được cập nhật sớm.</p></div>}

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