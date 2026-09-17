# EduSW Review Report

## Nghiêm trọng

1. Chấm đúng/sai sai bộ đếm khi người dùng trả lời thiếu
   - File: src/api/exam.api.ts
   - `questionIsCorrect` mặc định là `true`.
   - Nếu người dùng chỉ chọn một vài mệnh đề đúng, câu vẫn được tính vào `numCorrect`.
   - Cần kiểm tra đủ toàn bộ mệnh đề trước khi tính câu đúng.

2. Câu trả lời ngắn rỗng bị chuyển thành số 0
   - Files: src/components/CardQuestionShortAnswer.tsx, src/api/exam.api.ts
   - `Number("")` trả về `0`.
   - Người dùng chưa nhập đáp án vẫn bị đánh dấu đã trả lời.
   - Nếu đáp án đúng là 0, câu bỏ trống có thể được chấm đúng.

3. Dữ liệu index không đồng bộ với dữ liệu đề
   - File: public/data/exams/index.json
   - `demo_exam.json` và `pdf.json` tồn tại nhưng không có trong index.
   - Hai đề này không xuất hiện trên trang danh sách.
   - Chạy `scripts/build_exam_index.py` sẽ tạo index khác với index hiện tại.

## Lỗi dữ liệu

4. Một số đường dẫn PDF bị hỏng
   - Files: public/data/exams/demo_exam.json, public/data/exams/dlt_th_chuong1_hoa12_ketnoitrithuc.json
   - Các file trỏ tới PDF không tồn tại trong `public/documents/pdf`.
   - Nút “Tải tài liệu” sẽ dẫn tới 404.

5. Bộ lọc môn học thiếu “Lịch Sử”
   - File: src/pages/BaiTapPage.tsx
   - Dữ liệu có môn `Lịch Sử`, nhưng select chỉ có Toán, Vật lý và Hóa.
   - Người dùng không thể lọc riêng đề Lịch Sử.

## Lỗi render/UI

6. Kết quả đúng/sai hiển thị hai lựa chọn cùng được chọn khi người dùng trả lời sai
   - File: src/components/CardQuestionTrueFalse.tsx
   - Review dùng `checked={isStudentTrue || isCorrectTrue}` và tương tự cho Sai.
   - Khi người dùng chọn sai, cả lựa chọn của người dùng và đáp án đúng đều có thể hiển thị như đang được chọn, gây hiểu nhầm.

7. Trang chi tiết đề không có trạng thái loading/error
   - Files: src/pages/InfoExamPage.tsx, src/components/CardInfoExam.tsx
   - Khi tải lỗi hoặc chưa có dữ liệu, trang vẫn render card với nội dung rỗng.
   - Không có thông báo lỗi hoặc nút quay lại.

8. Nộp bài thất bại khiến người dùng không thể thử lại
   - File: src/pages/LambaiPage.tsx
   - `hasSubmitted.current` được đặt thành `true` trước khi request hoàn tất.
   - Nếu submit lỗi, nút nộp bị khóa nhưng chỉ log lỗi bằng `console.log`.

9. Có cảnh báo Tailwind trong HomePage
   - File: src/pages/HomePage.tsx
   - `rounded-[2rem]` nên đổi thành `rounded-4xl`.
   - `border-[24px]` nên đổi thành `border-24`.

## Cache và logic

10. Có thể tải và shuffle cùng một đề hai lần
    - File: src/api/exam.api.ts
    - `useQuestions` và `useInfoExam` được gọi đồng thời.
    - Cache chỉ được ghi sau khi `fetch` hoàn tất, nên hai request có thể cùng tải và shuffle riêng.
    - Kết quả review có thể khác thứ tự câu hoặc thứ tự đáp án so với lúc làm bài.

## Code thừa hoặc cần dọn dẹp

11. Có hai parser Markdown tạo JSON
    - Files: scripts/add_exam.py, scripts/md_to_json.py
    - `add_exam.py` là parser mới có CLI và validation.
    - `md_to_json.py` dùng cấu hình hard-code và chạy conversion ngay khi được import.
    - Nên giữ một parser duy nhất để tránh sinh JSON không nhất quán.

12. `scripts/parse.py` là script cũ, hard-code đường dẫn và metadata
    - File: scripts/parse.py
    - Có thể gây nhầm lẫn với pipeline hiện tại và không phù hợp để tái sử dụng.

13. Dữ liệu `explain` chưa được sử dụng
    - Files: public/data/exams/*.json, src/components/*
    - Mỗi câu có trường `results.explain`, nhưng màn hình kết quả không render phần giải thích.
    - Nếu chưa có kế hoạch dùng, đây là dữ liệu dư; nếu có, đang thiếu chức năng hiển thị.

14. Props dùng `any`
    - Files: src/components/CardQuestionFourChoice.tsx
      src/components/CardQuestionTrueFalse.tsx
      src/components/CardQuestionShortAnswer.tsx
    - `data: boolean | any` làm mất kiểm tra kiểu TypeScript.
    - Nên dùng một type cụ thể cho response kết quả.

## Kiểm tra hiện trạng

- Diagnostics hiện phát hiện 2 cảnh báo utility Tailwind trong `src/pages/HomePage.tsx`.
- Repo chưa có framework test.
- Chưa thể chạy hoặc ghi file trong Ask mode.