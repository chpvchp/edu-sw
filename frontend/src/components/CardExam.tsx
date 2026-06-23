import { Link } from "react-router-dom"
import type { Exam } from "../type/exam.type"

export default function CardExam({ id_exam, name_subject, name_exam, duration, created }: Exam) {

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  return (
    <Link to={`/backend-api/bai-tap/${id_exam}`} className="p-2 flex flex-col gap-2 border border-gray-200 rounded-md bg-white shadow transition duration-300 hover:scale-110 hover:shadow-xl">
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
          <p>Ngày tạo:</p>
          <p>{created}</p>
        </div>

      </div>
    </Link>
  )
}