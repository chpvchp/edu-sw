import FlashCard from "../components/FlashCard"

export default function FlashCardPage() {

  const data = {
    vocab: "Artificial Intelligence", mean: "Trí tuệ nhân tạo", pos: "noun phrase", ipa: "/ˌɑːrtɪˈfɪʃəl ɪnˈtelɪdʒəns/", example: "Artificial intelligence is changing the world"
  }

  return (
    <main className="min-h-screen flex-1 flex flex-col justify-center items-center">
      
      <FlashCard 
        vocab={data?.vocab}
        pos={data?.pos}
        ipa={data?.ipa}
        mean={data?.mean}
        example={data?.example}
      />

    </main>
  )
}