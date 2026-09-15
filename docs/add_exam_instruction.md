# Hướng dẫn thêm bài tập và đề thi - Add Exam Instruction

Data bài tập trong EduSW được lưu dưới dạng các file JSON trong `public/data/exams` và có schema như bên dưới - [xem schema JSON chi tiết](../public/data/exams/pdf.json)

```json
{
  "id_exam": "pdf",
  "id_subject": "toan",
  "name_exam": "Bộ đề mẫu PDF",
  "name_subject": "Toán",
  "class_exam": "12",
  "duration": 45,
  "updated": "2026-08-02T13:00:00.000",
  "created": "2026-08-01T08:00:00.000",
  "source": "/documents/pdf/pdf.pdf",
  "questions": [
    {
      "id_question": "pdf-q1",
      "order": 1,
      "question": "Lorem",
      "path_images": null,
      "type_question": "four_choice",
      "answers": [
        {"id_answer": "pdf-q1-a", "answer": "Lorem"},
        {"id_answer": "pdf-q1-b", "answer": "Lorem"},
        {"id_answer": "pdf-q1-c", "answer": "Lorem"},
        {"id_answer": "pdf-q1-d", "answer": "Lorem"}
      ],
      "results": {
        "explain": "",
        "correct_answer": "pdf-q1-b",
        "true_answer": [],
        "false_answer": [],
        "short_answer": ""
      }
    },
    {
      "id_question": "pdf-q5",
      "order": 5,
      "question": "Lorem",
      "path_images": "/data/images/pdf/pdf_2_5.jpg",
      "type_question": "true_false",
      "answers": [
        {"id_answer": "pdf-q5-a", "answer": "Lorem"},
        {"id_answer": "pdf-q5-b", "answer": "Lorem"},
        {"id_answer": "pdf-q5-c", "answer": "Lorem"},
        {"id_answer": "pdf-q5-d", "answer": "Lorem"}
      ],
      "results": {
        "explain": "",
        "correct_answer": "",
        "true_answer": ["pdf-q5-a", "pdf-q5-c"],
        "false_answer": ["pdf-q5-b", "pdf-q5-d"],
        "short_answer": ""
      }
    },
    {
      "id_question": "pdf-q10",
      "order": 10,
      "question": "Lorem",
      "path_images": null,
      "type_question": "short_answer",
      "answers": [],
      "results": {
        "explain": "",
        "correct_answer": "",
        "true_answer": [],
        "false_answer": [],
        "short_answer": 10
      }
    }
  ]
}
```

Ngoài ra còn có [index.json](../public/data/exams/index.json) đóng vai trò danh sách các bài tập hoặc đề thi khi cần liệt kê.

Các ảnh đính kèm trong câu hỏi được lưu trữ tại `public/data/images/<id_bai_tap>`

Các file markdown gốc được lưu tại `public/documents/md` cho mục đích convert_to_json.