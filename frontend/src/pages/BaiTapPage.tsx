import CardExam from "../components/CardExam";
import { useListExam } from "../hook/useExam";
import type { Exam } from "../type/exam.type";

export default function BaiTapPage() {

  const { data, isLoading, error } = useListExam();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;


  return (
    <main className="flex-1 flex flex-col">

      <div className="flex justify-center">
        <p className="p-4 italic">Chọn các bài tập bên dưới để rèn luyện nhé:3</p>
      </div>

      <div className="p-4 flex flex-col lg:grid lg:grid-cols-6 justify-center mt-4 gap-2 lg:gap-6 lg:mx-auto">

        {data?.map((exam: Exam) => (
          <CardExam
            key={exam.id_exam}
            id_exam={exam.id_exam}
            name_exam={exam.name_exam}
            name_subject={exam.name_subject}
            duration={exam.duration}
            created={exam.created}
          />
        ))}

      </div>

    </main>
  )
}