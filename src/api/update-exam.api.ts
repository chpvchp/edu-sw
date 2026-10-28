import type { ExamMetadata, ExamQuestion, GeneratedExam } from "../type/update-exam.type";

const QUESTION_RE = /^\*\*Câu\s+\d+(?::\*\*|\*\*:)?\s*(.*)$/;
const FOUR_CHOICE_RE = /^\*\*([A-D])\.?\*\*\s*(.*)$/;
const TRUE_FALSE_RE = /^\*([a-d])\)\*\s*(.*)$/;
const SHORT_ANSWER_RE = /^\*\*Đáp án là:\*\*\s*(.*)$/;

function stripMarker(value: string): string {
  return value
    .replace(/\s+\*\*ĐápÁnĐúng\*\*|\s+ĐápÁnĐúng/g, "")
    .replace(/\s+\*\*ĐápÁnSai\*\*|\s+ĐápÁnSai/g, "")
    .trim();
}

/**
 * normalizeImportedText | chuẩn hóa văn bản nhập.
 * Converts common plain-text question notation into the Markdown notation consumed by the exam parser.
 * Chuyển các dạng câu hỏi văn bản phổ biến sang cú pháp Markdown mà bộ phân tích đề đang sử dụng.
 */
export function normalizeImportedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (/^Câu\s+\d+[.:]/.test(trimmed)) {
        return trimmed.replace(/^Câu\s+(\d+)[.:]\s*/, "**Câu $1:** ");
      }
      if (/^[A-D]\.\s+/.test(trimmed)) {
        return trimmed.replace(/^([A-D])\.\s+/, "**$1.** ");
      }
      if (/^[a-d]\)\s+/.test(trimmed)) {
        return trimmed.replace(/^([a-d])\)\s+/, "*$1)* ");
      }
      return line;
    })
    .join("\n");
}

/**
 * parseExamMarkdown | phân tích Markdown đề.
 * Builds the JSON exam payload from the same markers documented in the repository template.
 * Dựng payload JSON từ các marker được mô tả trong template của repository.
 */
export function parseExamMarkdown(markdown: string, metadata: ExamMetadata): GeneratedExam {
  const body = markdown.replace(/^---[\s\S]*?---\s*/, "");
  const questions: ExamQuestion[] = [];
  let currentQuestion: ExamQuestion | undefined;

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const questionMatch = line.match(QUESTION_RE);
    if (questionMatch) {
      const questionNumber = questions.length + 1;
      currentQuestion = {
        id_question: `${metadata.id_exam}-q${questionNumber}`,
        order: questionNumber,
        question: questionMatch[1],
        type_question: "four_choice",
        path_images: null,
        answers: [],
        results: {
          explain: "",
          correct_answer: null,
          true_answer: [],
          false_answer: [],
          short_answer: "",
        },
      };
      questions.push(currentQuestion);
      continue;
    }

    if (!currentQuestion) continue;

    const fourChoice = line.match(FOUR_CHOICE_RE);
    if (fourChoice) {
      const answerId = `${currentQuestion.id_question}-${fourChoice[1].toLowerCase()}`;
      currentQuestion.type_question = "four_choice";
      if (line.includes("ĐápÁnĐúng")) currentQuestion.results.correct_answer = answerId;
      currentQuestion.answers.push({ id_answer: answerId, answer: stripMarker(fourChoice[2]) });
      continue;
    }

    const trueFalse = line.match(TRUE_FALSE_RE);
    if (trueFalse) {
      const answerId = `${currentQuestion.id_question}-${trueFalse[1]}`;
      currentQuestion.type_question = "true_false";
      if (line.includes("ĐápÁnĐúng")) currentQuestion.results.true_answer.push(answerId);
      if (line.includes("ĐápÁnSai")) currentQuestion.results.false_answer.push(answerId);
      currentQuestion.answers.push({ id_answer: answerId, answer: stripMarker(trueFalse[2]) });
      continue;
    }

    const shortAnswer = line.match(SHORT_ANSWER_RE);
    if (shortAnswer) {
      currentQuestion.type_question = "short_answer";
      currentQuestion.results.short_answer = shortAnswer[1].trim();
      continue;
    }

    if (line.startsWith("![](")) {
      const imagePath = line.match(/!\[\]\(([^)]+)\)/)?.[1];
      if (imagePath) currentQuestion.path_images = `/data/images/${metadata.id_exam}/${imagePath}`;
      continue;
    }

    currentQuestion.question += `\n${line}`;
  }

  return { ...metadata, questions };
}

export function validateGeneratedExam(exam: GeneratedExam): string[] {
  const errors: string[] = [];
  if (!exam.id_exam.trim()) errors.push("ID đề không được để trống.");
  if (!exam.name_exam.trim()) errors.push("Tên đề không được để trống.");
  if (!exam.name_subject.trim()) errors.push("Môn học không được để trống.");
  if (!exam.duration || exam.duration < 1) errors.push("Thời gian kiểm tra phải lớn hơn 0 phút.");
  if (exam.questions.length === 0) errors.push("Markdown chưa có câu hỏi nào.");

  exam.questions.forEach((question, index) => {
    const label = `Câu ${index + 1}`;
    if (question.type_question === "four_choice" && (!question.results.correct_answer || question.answers.length < 4)) {
      errors.push(`${label} cần đủ 4 đáp án và có marker ĐápÁnĐúng.`);
    }
    if (question.type_question === "true_false" && (question.answers.length < 4 || !question.results.true_answer.length || !question.results.false_answer.length)) {
      errors.push(`${label} dạng đúng/sai cần đủ đáp án và marker ĐápÁnĐúng/ĐápÁnSai.`);
    }
    if (question.type_question === "short_answer" && !question.results.short_answer) {
      errors.push(`${label} chưa có đáp án ngắn.`);
    }
  });
  return errors;
}

export function buildMarkdown(metadata: ExamMetadata, body: string): string {
  return `---
id_exam: ${metadata.id_exam}
id_subject: ${metadata.id_subject}
name_exam: ${metadata.name_exam}
name_subject: ${metadata.name_subject}
class_exam: ${metadata.class_exam}
duration: ${metadata.duration}
source: ${metadata.source}
created: ${metadata.created}
updated: ${metadata.updated}
---

# ${metadata.name_exam}

${body.trim()}
`;
}
