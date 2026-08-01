import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/**
 * RenderMarkDownLatex | bộ hiển thị Markdown + LaTeX.
 * Converts exam text into rendered Markdown and math output so questions and answers can include formatted content safely.
 * Chuyển nội dung đề sang Markdown và công thức LaTeX đã dựng sẵn để câu hỏi và đáp án có thể chứa định dạng một cách an toàn.
 */
export default function RenderMarkDownLatex({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {text}
    </ReactMarkdown>
  );
}