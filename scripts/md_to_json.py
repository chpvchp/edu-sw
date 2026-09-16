import re
import json
from pathlib import Path

def clean_line(line):
    return line.strip()

def is_question(line):
    return line.startswith("**Câu ")

def is_question_in(line):
    return re.match(r"^\*\([a-z]\)\*", line) or re.match(r"^\*\(\d+\)\*", line) or re.match(r"^- Bước ", line)

def is_answer_four_choice(line):
    return re.match(r"^\*\*[A-D]\.\*\*", line)

def is_answer_true_false(line):
    return re.match(r"^\*[a-d]\)\*", line)

def is_answer_short_answer(line):
    return line.startswith("**Đáp án là:** ")

def is_path_image(line):
    return line.startswith("![](")

def is_correct_four_choice(line):
    if "ĐápÁnĐúng" not in line:
        return False
    else:
        return True

def clean_question(line):
    return re.sub(r"^\*\*Câu\s+\d+(?::\*\*|\*\*:)?\s*", "", line)

def remove_correct_marker(line):
    return re.sub(r"\s+\*\*ĐápÁnĐúng\*\*|\s+ĐápÁnĐúng", "", line)

def clean_answer(line):
    return re.sub(r"^\*\*[A-D]\.\*\*\s*|^\*[a-d]\)\*\s*", "", line)

def parse(path, id_exam, id_subject, name_exam, name_subject, class_exam, duration, created, source):
    path_exam = path
    
    questions = []
    current_question = None
    order = 1
    
    exam = {
        "id_exam": id_exam,
        "id_subject": id_subject,
        "name_exam": name_exam,
        "name_subject": name_subject,
        "class_exam": class_exam,
        "duration": duration,
        "updated": created,
        "created": created,
        "source": source,
        "questions": questions,
    }
    
    with open(path_exam, "r", encoding="utf-8") as file:
        q = 1
        abcd = [0, "a", "b", "c", "d", "e", "f", "g", "h", "i"]
        for line in file:
            line = clean_line(line)

            if is_question(line):
                a = 1
                line = clean_question(line)
                id_question = id_exam + f"-q{q}"
                q += 1
                
                current_question = {
                    "id_question": id_question,
                    "order": order,
                    "question": line,
                    "type_question": "",
                    "path_images": None,
                    "answers": [],
                    "results": {
                        "explain": "",
                        "correct_answer": None,
                        "true_answer": [],
                        "false_answer": [],
                        "short_answer": ""
                    }
                }
                
                questions.append(current_question)
                order += 1
                
            elif is_question_in(line) and current_question:
                current_question["question"] += "\n" + line
                
            elif is_path_image(line) and current_question:
                current_question["path_images"] = f"/data/images/{id_exam}/" + line[4:-1]
                
            
            elif is_answer_four_choice(line) and current_question:
                id_answer = id_question + f"-{abcd[a]}"
                a += 1
                
                if current_question["type_question"] != "four_choice":
                    current_question["type_question"] = "four_choice"
                
                if is_correct_four_choice(line):
                    current_question["results"]["correct_answer"] = id_answer
                    line = remove_correct_marker(line)

                line = clean_answer(line)
                    
                answer = {
                    "id_answer": id_answer,
                    "answer": line
                }
                current_question["answers"].append(answer)
                
            elif is_answer_true_false(line) and current_question:
                id_answer = id_question + f"-{abcd[a]}"
                a += 1
                
                if current_question["type_question"] != "true_false":
                    current_question["type_question"] = "true_false"
                    
                if "ĐápÁnĐúng" in line:
                    current_question["results"]["true_answer"].append(id_answer)
                    line = remove_correct_marker(line)
                elif "ĐápÁnSai" in line:
                    current_question["results"]["false_answer"].append(id_answer)
                    line = re.sub(r"\s+\*\*ĐápÁnSai\*\*|\s+ĐápÁnSai", "", line)

                line = clean_answer(line)
                    
                answer = {
                    "id_answer": id_answer,
                    "answer": line
                }
                current_question["answers"].append(answer)
                
            elif is_answer_short_answer(line) and current_question:
                if current_question["type_question"] != "short_answer":
                    current_question["type_question"] = "short_answer"
                
                current_question["results"]["short_answer"] = line[11:]
                
                
    output_path = Path("./public/data/exams") / f"{id_exam}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8") as file:
        data_json = json.dumps(exam, indent=2, ensure_ascii=False)
        file.write(data_json)



path = "./public/documents/md/dlt_th_chuong1_hoa12_ketnoitrithuc.md"
id_exam = "dlt_th_chuong1_hoa12_ketnoitrithuc"
id_subject = "hoa"
name_exam = "ĐỀ LUYỆN TẬP TỔNG HỢP CHƯƠNG 1 ESTER – LIPID. XÀ PHÒNG VÀ CHẤT GIẶT RỬA TỔNG HỢP - ĐỀ SỐ 1"
name_subject = "Hóa"
class_exam = 12
duration = 40
created = "2026-09-16T21:56:00.000"
source = f"/documents/pdf/{id_exam}.pdf"


    
parse(
    path=path,
    id_exam=id_exam,
    id_subject=id_subject,
    name_exam=name_exam,
    name_subject=name_subject,
    class_exam=class_exam,
    duration=duration,
    created=created,
    source=source
)