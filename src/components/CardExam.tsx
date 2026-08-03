import { Link } from "react-router-dom"
import type { InfoExam } from "../type/infoexam.type"
import { ConvertDate } from "../hook/useConvert"

/**
 * CardExam | thẻ bài tập.
 * Renders a compact exam summary card in the practice list, including subject, duration, and creation time.
 * Hiển thị thẻ tóm tắt bài tập trong danh sách luyện đề, gồm môn học, thời lượng và thời điểm tạo.
 */
export default function CardExam({ id_exam, name_subject, name_exam, duration, updated, created }: InfoExam) {

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  return (
    <Link to={`/bai-tap/${id_exam}`} className="p-2 flex flex-col gap-2 border border-gray-200 rounded-md bg-white shadow transition duration-300 hover:scale-110 hover:shadow-xl">
      <h2 className="p-2 font-bold border border-gray-200 rounded-md text-center">{name_exam}</h2>
      <div>

        <div className={classNameInfo}>
          <p>Môn:</p>
          <p>{name_subject}</p>
        </div>

        <div className={classNameInfo}>
          <p>Thời gian làm bài:</p>
          <p>{duration} phút</p>
        </div>

        <div className={classNameInfo}>
          <p>Chỉnh sửa:</p>
          <p>{ConvertDate(updated)}</p>
        </div>

        <div className={classNameInfo}>
          <p>Ngày tạo:</p>
          <p>{ConvertDate(created)}</p>
        </div>

      </div>
    </Link>
  )
}