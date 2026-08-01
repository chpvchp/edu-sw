import { useParams } from "react-router-dom";
import { useInfoExam } from "../hook/useExam";
import CardInfoExam from "../components/CardInfoExam";

export default function InfoExamPage() {
  const { id_exam } = useParams();
  const idExam = String(id_exam)
  const { data } = useInfoExam( idExam );

  return (
    <main className="min-h-screen max-w-7xl flex-1 mx-auto">
      <CardInfoExam
        data={data}
      />
    </main>
  )
}