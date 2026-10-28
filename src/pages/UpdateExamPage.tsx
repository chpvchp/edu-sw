import { useMemo, useState } from "react";
import { FileDown, FolderOpen, Save, Upload } from "lucide-react";
import TurndownService from "turndown";
import mammoth from "mammoth";
import RenderMarkDownLatex from "../components/RenderMarkDownLatex";
import { buildMarkdown, normalizeImportedText, parseExamMarkdown, validateGeneratedExam } from "../api/update-exam.api";
import type { ExamMetadata } from "../type/update-exam.type";

const subjects = [
  ["toan", "Toán"], ["ly", "Vật lý"], ["hoa", "Hóa học"], ["sinh", "Sinh học"],
  ["su", "Lịch sử"], ["dia", "Địa lý"], ["anh", "Tiếng Anh"], ["van", "Ngữ văn"], ["tin", "Tin học"],
];

const initialMetadata: ExamMetadata = {
  id_exam: "de-moi",
  id_subject: "toan",
  name_exam: "Đề mới",
  name_subject: "Toán",
  class_exam: "12",
  duration: 45,
  created: new Date().toISOString().slice(0, 16),
  updated: new Date().toISOString().slice(0, 16),
  source: "/documents/pdf/de-moi.pdf",
};

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

async function writeFile(directory: FileSystemDirectoryHandle, path: string, content: string) {
  let current = directory;
  const parts = path.split("/");
  const fileName = parts.pop();
  if (!fileName) throw new Error("Tên file không hợp lệ.");
  for (const part of parts) current = await current.getDirectoryHandle(part, { create: true });
  const file = await current.getFileHandle(fileName, { create: true });
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
}

async function readFile(directory: FileSystemDirectoryHandle, path: string): Promise<string> {
  let current = directory;
  const parts = path.split("/");
  const fileName = parts.pop();
  if (!fileName) throw new Error("Tên file không hợp lệ.");
  for (const part of parts) current = await current.getDirectoryHandle(part);
  const file = await current.getFileHandle(fileName);
  return (await file.getFile()).text();
}

type FileSystemWindow = Window & {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
};

/**
 * UpdateExamPage | trang tạo đề local.
 * Imports supported documents, lets the author edit Markdown beside a live preview, and writes generated files into a picked local public folder.
 * Nhập tài liệu, cho phép chỉnh sửa Markdown cạnh preview trực tiếp và ghi các file sinh ra vào thư mục public được chọn trên máy local.
 */
export default function UpdateExamPage() {
  const [metadata, setMetadata] = useState(initialMetadata);
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const exam = useMemo(() => parseExamMarkdown(markdown, metadata), [markdown, metadata]);

  const updateMetadata = (key: keyof ExamMetadata, value: string) => {
    setMetadata((current) => ({ ...current, [key]: key === "duration" ? Number(value) : value, updated: new Date().toISOString().slice(0, 16) }));
  };

  const importFile = async (file: File) => {
    setError("");
    if (file.name.toLowerCase().endsWith(".docx")) {
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      setMarkdown(normalizeImportedText(new TurndownService().turndown(result.value)));
    } else {
      setMarkdown(normalizeImportedText(await file.text()));
    }
    setMessage(`Đã nhập ${file.name}. Hãy rà soát cú pháp và đáp án trước khi tạo đề.`);
  };

  const createExam = async () => {
    setError("");
    const errors = validateGeneratedExam(exam);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }
    const finalMarkdown = buildMarkdown(metadata, markdown);
    const indexEntry = { ...metadata, id_subject: metadata.id_subject };
    try {
      const directoryPicker = (window as FileSystemWindow).showDirectoryPicker;
      if (!directoryPicker) throw new Error("Trình duyệt không hỗ trợ ghi thư mục.");
      const directory = await directoryPicker();
      const index = JSON.parse(await readFile(directory, "data/exams/index.json")) as Array<Record<string, unknown>>;
      const nextIndex = [...index.filter((item) => item.id_exam !== metadata.id_exam), indexEntry].sort((a, b) => String(a.id_exam).localeCompare(String(b.id_exam)));
      await writeFile(directory, `documents/md/${metadata.id_exam}.md`, finalMarkdown);
      await writeFile(directory, `data/exams/${metadata.id_exam}.json`, JSON.stringify(exam, null, 2));
      await writeFile(directory, "data/exams/index.json", JSON.stringify(nextIndex, null, 2) + "\n");
      setMessage("Đã ghi Markdown, JSON và cập nhật index.json vào thư mục public đã chọn.");
    } catch (writeError) {
      if (writeError instanceof DOMException && writeError.name === "AbortError") return;
      downloadFile(`${metadata.id_exam}.md`, finalMarkdown, "text/markdown;charset=utf-8");
      downloadFile(`${metadata.id_exam}.json`, JSON.stringify(exam, null, 2), "application/json");
      setMessage("Trình duyệt không cho ghi thư mục trực tiếp; đã tải Markdown và JSON xuống để bạn chép vào public.");
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#27735f]">Local authoring tool</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#18324b]">Cập nhật đề</h1>
        <p className="mt-2 text-sm text-[#6c8494]">Trang ẩn dùng khi chạy local. Chọn đúng thư mục public khi bấm Tạo đề để ghi file trực tiếp.</p>
      </div>

      <section className="mb-6 grid gap-3 rounded-2xl border border-[#dbe7ee] bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-semibold">ID đề<input value={metadata.id_exam} onChange={(e) => updateMetadata("id_exam", e.target.value)} className="mt-1 w-full rounded-xl border p-2.5" /></label>
        <label className="text-sm font-semibold">Tên đề<input value={metadata.name_exam} onChange={(e) => updateMetadata("name_exam", e.target.value)} className="mt-1 w-full rounded-xl border p-2.5" /></label>
        <label className="text-sm font-semibold">Lớp<select value={metadata.class_exam} onChange={(e) => updateMetadata("class_exam", e.target.value)} className="mt-1 w-full rounded-xl border p-2.5"><option>10</option><option>11</option><option>12</option></select></label>
        <label className="text-sm font-semibold">Môn<select value={metadata.id_subject} onChange={(e) => { const subject = subjects.find(([id]) => id === e.target.value); setMetadata((current) => ({ ...current, id_subject: e.target.value, name_subject: subject?.[1] ?? "", updated: new Date().toISOString().slice(0, 16) })); }} className="mt-1 w-full rounded-xl border p-2.5">{subjects.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <label className="text-sm font-semibold">Thời gian kiểm tra (phút)<input type="number" min="1" value={metadata.duration} onChange={(e) => updateMetadata("duration", e.target.value)} className="mt-1 w-full rounded-xl border p-2.5" /></label>
        <label className="text-sm font-semibold">Thời gian tạo đề<input type="datetime-local" value={metadata.created} onChange={(e) => updateMetadata("created", e.target.value)} className="mt-1 w-full rounded-xl border p-2.5" /></label>
      </section>

      <section className="mb-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#18324b] px-4 py-3 text-sm font-bold text-white"><Upload className="h-4 w-4" />Nhập DOCX/TXT/MD<input type="file" accept=".docx,.txt,.md" className="hidden" onChange={(e) => e.target.files?.[0] && void importFile(e.target.files[0])} /></label>
        <button type="button" onClick={() => setMarkdown(`**Câu 1:** Nội dung câu hỏi?\n\n**A.** Đáp án A\n**B.** Đáp án B **ĐápÁnĐúng**\n**C.** Đáp án C\n**D.** Đáp án D`)} className="inline-flex items-center gap-2 rounded-xl border border-[#cbdde6] bg-white px-4 py-3 text-sm font-bold text-[#18324b]"><FileDown className="h-4 w-4" />Dùng mẫu</button>
        <button type="button" onClick={() => void createExam()} className="inline-flex items-center gap-2 rounded-xl bg-[#27735f] px-4 py-3 text-sm font-bold text-white"><Save className="h-4 w-4" />Tạo đề vào public</button>
      </section>
      {message && <p className="mb-3 rounded-xl bg-[#e9f7f0] p-3 text-sm text-[#27735f]">{message}</p>}
      {error && <p className="mb-3 rounded-xl bg-[#fff1df] p-3 text-sm text-[#a85c18]">{error}</p>}

      <section className="grid min-h-[620px] gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-[#dbe7ee] bg-white p-4 shadow-sm"><h2 className="mb-3 font-bold text-[#18324b]">Markdown editor</h2><textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} placeholder="Dán nội dung theo docs/exam_template.md..." className="min-h-[560px] flex-1 resize-none rounded-xl border bg-[#f7fafc] p-4 font-mono text-sm leading-6 outline-none focus:border-[#27735f]" /></div>
        <div className="rounded-2xl border border-[#dbe7ee] bg-white p-4 shadow-sm"><h2 className="mb-3 font-bold text-[#18324b]">Preview</h2><div className="prose max-w-none rounded-xl bg-[#f7fafc] p-4"><RenderMarkDownLatex text={markdown || "Preview sẽ hiển thị tại đây."} /></div><p className="mt-4 flex items-center gap-2 text-xs text-[#6c8494]"><FolderOpen className="h-4 w-4" />Chọn thư mục public để ghi trực tiếp; không có backend hay xác thực.</p></div>
      </section>
    </main>
  );
}
