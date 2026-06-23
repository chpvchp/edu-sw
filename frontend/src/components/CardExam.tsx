export default function CardExam() {

  const classNameInfo = "flex gap-4 justify-between text-gray-600"

  return (
    <div className="p-2 flex flex-col gap-2 border border-gray-200 rounded-md bg-white shadow transition duration-300 hover:scale-110 hover:shadow-xl">
      <h2 className="p-2 font-bold border border-gray-200 rounded-md text-center">Title Exam</h2>
      <div>

        <div className={classNameInfo}>
          <p>Subject:</p>
          <p>Math</p>
        </div>

        <div className={classNameInfo}>
          <p>Duration:</p>
          <p>5 min</p>
        </div>

        <div className={classNameInfo}>
          <p>Created:</p>
          <p>2026-06-2 12h00</p>
        </div>

      </div>
    </div>
  )
}