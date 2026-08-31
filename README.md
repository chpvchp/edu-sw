# EduSW 🎓

**EduSW** là một trang web tĩnh được xây dựng bằng React. Nó được tạo ra nhằm mục đích hỗ trợ các bạn học cùng khối trong trường được rèn luyện bài tập hằng ngày giúp đạt kết quả học tập tốt hơn. Đồng thời nó cũng rèn luyện kỹ năng viết web với framework hiện đại cho tác giả.

Dự án này có sự hỗ trợ từ AI đóng vai trò là review code, đánh giá kiến trúc và hỗ trợ debug lỗi.

AI được dùng cho dự án bao gồm:
- ChatGPT free
- GPT-5.6 Sol
- Qwen3.6 35B A3B

---

## 📂 Cấu trúc dự án - Project Structure

Dự án EduSW được xây dựng dựa theo cấu trúc mặc định của React Vite với sự điều chỉnh phù hợp, cụ thể:

```text
edu-sw/
├── public/
│   ├── data/            # Chứa JSON data và Images data cho các bài tập (exam)
│   ├── documents/       # Chứa tài liệu gốc dạng pdf và md
│   ├── icons/           # Chứa các icon của web
├── src/
│   ├── api/             # Các lớp API
│   ├── components/      # Các components tái sử dụng nhiều(Card..., etc.)
│   ├── hooks/           # React Hooks (useExam, useSubmit, etc.)
│   ├── layouts/         # Page layouts (MainLayout)
│   ├── pages/           # Route-based pages (HomePage, BaiTapPage, ...)
│   ├── routes/          # Chuyển hướng các trang mục
│   └── type/            # Định nghĩa kiểu dữ liệu của TypeScript
├── AGENTS.md            # Các quy tắc, hướng dẫn khi làm việc với dự án cho AGENT
```
---

## Các hướng dẫn - Instructions

- [Hướng dẫn cài đặt - Install Instruction](docs/install_instruction.md)
- [Hướng dẫn thêm bài tập và đề thi - Add Exam Instruction](docs/add_exam_instruction.md)



## 📝 Giấy phép - License

Dự án có giấy phép MIT License - [xem chi tiết tại đây](LICENSE)

---

## Agents.md Instruction

[Xem tại đây](AGENTS.md)


## 👨‍💻 Tác giả - Author

**Cao Hoàng Phúc**
- GitHub: [@chpvchp](https://github.com/chpvchp)
- HuggingFace: [@chpvchp](https://huggingface.co/chpvchp)