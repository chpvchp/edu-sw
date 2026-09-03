import type { FlashCard } from "../type/flashcard.type"
import { ConvertDate } from "../hooks/useConvert"
import { Link } from "react-router-dom"


export default function CardFlashCard ({ id_flashcard, name_flashcard, language, num_cards, updated, created, source } : FlashCard) {
  const classNameInfo = "flex gap-4 justify-between text-gray-600"
  console.log(id_flashcard, source)
  return (
    <Link to={`/flashcard/${id_flashcard}/practice`} className="p-2 flex flex-col gap-2 border border-gray-200 rounded-md bg-white shadow transition duration-300 hover:scale-110 hover:shadow-xl">

      <h2 className="p-2 font-bold border border-gray-200 rounded-md text-center">{name_flashcard}</h2>
      <div>

        <div className={classNameInfo}>
          <p>Language:</p>
          <p>{language}</p>
        </div>

        <div className={classNameInfo}>
          <p>Count:</p>
          <p>{num_cards}</p>
        </div>

        {/* <div className={classNameInfo}>
          <p>Source:</p>
          <p>{source}</p>
        </div> */}

        <div className={classNameInfo}>
          <p>Updated:</p>
          <p>{ConvertDate(updated)}</p>
        </div>

        <div className={classNameInfo}>
          <p>Created:</p>
          <p>{ConvertDate(created)}</p>
        </div>

        

      </div>
    </Link>
  )
}