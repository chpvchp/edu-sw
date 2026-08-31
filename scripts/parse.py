from core.parse.parse_clean_md import parse_clean_md

input_path = "./cache/raw.md"
output_path = "./cache/exam/exam.md"

# Đọc file Markdown
with open(input_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Clean nội dung
cleaned, total_count = parse_clean_md(md_content)

# Ghi ra file mới
with open(output_path, "w", encoding="utf-8") as f:
    f.write(cleaned)

print(f"Đã lưu file đã clean vào: {output_path}, {total_count}")