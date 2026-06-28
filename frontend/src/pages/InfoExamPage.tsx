import { useParams } from "react-router-dom";
import { useInfoExam } from "../hook/useExam";
import CardInfoExam from "../components/CardInfoExam";

export default function InfoExamPage() {
  const { id_exam } = useParams();
  const idExam = String(id_exam)
  const { data } = useInfoExam( idExam );

  return (
    <main className="flex-1 flex flex-col bg-slate-50 items-center">
      <CardInfoExam
        data={data}
      />
      <div className="flex mt-2 p-2">
        <p>--- Lịch sử làm bài ---</p>
      </div>
    </main>
  )
}