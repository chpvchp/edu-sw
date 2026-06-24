import { Link } from "react-router-dom"
import type { InfoExam } from "../type/infoexam.type"

type CardInfoExamProps = {
  data?: InfoExam
}

export default function CardInfoExam({ data }: CardInfoExamProps) {

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  return (
    <div className="mt-4 p-2 flex flex-col gap-2 border border-gray-200 rounded-md bg-white shadow">
      <h1 className="p-2 font-bold border border-gray-200 rounded-md text-center">{data?.name_exam}</h1>
      <div className="flex flex-col">

        <div className={classNameInfo}>
          <p>Môn:</p>
          <p>{data?.name_subject}</p>
        </div>

        <div className={classNameInfo}>
          <p>Thời gian làm bài:</p>
          <p>{data?.duration} phút</p>
        </div>

        <div className={classNameInfo}>
          <p>Ngày tạo:</p>
          <p>{data?.created}</p>
        </div>

        <Link to={`/bai-tap/${data?.id_exam}/lam-bai`} className="mt-2 p-2 bg-blue-600 rounded-md text-center text-white font-bold transition duration-200 hover:bg-blue-800">
          Làm bài
        </Link>

      </div>
    </div>
  )
}