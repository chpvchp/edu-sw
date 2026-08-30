# Repository Guidelines

## Tổng quát

**EduSW** là một trang web tĩnh được xây dựng bằng React. Nó được tạo ra nhằm mục đích hỗ trợ các bạn học cùng khối trong trường được rèn luyện bài tập hằng ngày giúp đạt kết quả học tập tốt hơn. Đồng thời nó cũng rèn luyện kỹ năng viết web với framework hiện đại cho tác giả.

## 📂 Cấu trúc dự án - Project Structure

Dự án EduSW được xây dựng dựa theo cấu trúc mặc định của React Vite với sự điều chỉnh phù hợp, cụ thể:

```text
edu-sw/
├── public/
│   ├── data/            # Chứa JSON data và Images data cho các bài tập (exam)
│   ├── documents/       # Chứa tài liệu gốc dạng pdf và md
├── src/
│   ├── api/             # Các lớp API
│   ├── components/      # Các components tái sử dụng nhiều(Cards, Nav, etc.)
│   ├── hooks/            # React Hooks (useExam, useSubmit, etc.)
│   ├── layouts/         # Page layouts (MainLayout)
│   ├── pages/           # Route-based pages (Home, ExamList, Results)
│   ├── routes/          # Chuyển hướng các trang mục
│   └── type/            # Định nghĩa kiểu dữ liệu của TypeScript
├── AGENTS.md            # Các quy tắc, hướng dẫn khi làm việc với dự án cho AGENT
```
---

## Các câu lệnh AGENT có thể dùng

| Command | Description |
|---|---|
| `npm run dev` | Chạy server ở chế độ dev (`0.0.0.0:5173`) |
| `npm run build` | Build dự án để preview hoặc deploy |
| `npm run lint` | Kiểm tra code có vi phạm quy tắc không |
| `npm run preview` | Preview production sau khi build local |
| `npm run deploy` | Build và push deploy tự động lên GitHub Pages (gh-pages) |

## Phong cách viết code và đặt tên bắt buộc AGENT phải tuân theo

* **Thụt lề 2 khoảng trắng** (được oxlint bắt buộc).

* Sử dụng **TypeScript** (`.ts` / `.tsx`).

* **Component:** sử dụng **PascalCase** (`CardExam`).

* **Hàm, biến và hook:** sử dụng **camelCase** (`calculateScore`, `loadExamData`, `useSubmitQuestionAnswer`).

* **JSDoc:** định dạng **song ngữ** — tiếng Anh trước, tiếng Việt sau.

  - Ví dụ:
  ```tsx
  /**
  CardInfoExam | thẻ thông tin đề.
  Shows the selected exam metadata and exposes the entry point to start the practice session.
  Hiển thị thông tin cơ bản của đề đã chọn và cung cấp nút để bắt đầu làm bài.
  */
  ```

* **Cấu trúc file:** đặt **helper trước các public export** để dependency được đọc theo thứ tự từ trên xuống dưới.

* **Tailwind:** sử dụng các **utility class** trực tiếp trên các phần tử JSX.

## Kiểm thử

Hiện tại chưa cấu hình framework kiểm thử. Khi được thêm vào, hãy tuân theo:

* **Đặt tên file:** `src/<module>/<module>.test.ts`.
* **Chạy kiểm thử:** sử dụng `npm test` (script sẽ được cấu hình sau).

## Quy tắc Commit & Pull Request

* **Commit:** sử dụng định dạng **Conventional Commits** — `type: description` (`feat`, `fix`, `chore`, `docs`, `refactor`, `data`).

  * Ví dụ: `feat: add field class_exam and updated`.

* **Pull Request (PR):**

  * Chưa có thông tin về PR

## Triển khai

`npm run deploy` sẽ:

1. Build project.
2. Tự động sao chép `dist/index.html` → `dist/404.html` để hỗ trợ SPA routing.
3. Publish lên branch `gh-pages`.

**Đảm bảo `npm run lint` chạy thành công trước khi deploy.**

