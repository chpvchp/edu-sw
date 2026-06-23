import CardExam from "../components/CardExam";

export default function BaiTapPage() {
  return (
    <main className="flex-1 flex flex-col bg-slate-50">

      <div className="flex justify-center">
        <p className="p-4 italic">Chọn các bài tập bên dưới để rèn luyện nhé:3</p>
      </div>

      <div className="flex gap-2 justify-center mt-4">

        <CardExam />

      </div>

    </main>
  )
}