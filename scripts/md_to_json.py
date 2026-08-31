import os
import re
import json
import uuid
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
                line = line + "\n"
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
                        "explain": None,
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
                    line = line.replace("ĐápÁnĐúng", "")
                    line = clean_line(line)
                    
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
                    line = line.replace("ĐápÁnĐúng", "")
                    line = clean_line(line)
                elif "ĐápÁnSai" in line:
                    current_question["results"]["false_answer"].append(id_answer)
                    line = line.replace("ĐápÁnSai", "")
                    line = clean_line(line)
                    
                answer = {
                    "id_answer": id_answer,
                    "answer": line
                }
                current_question["answers"].append(answer)
                
            elif is_answer_short_answer(line) and current_question:
                id_answer = uuid.uuid4().hex
                
                if current_question["type_question"] != "short_answer":
                    current_question["type_question"] = "short_answer"
                
                current_question["results"]["short_answer"] = line[11:]
                
                
    with open(f"{id_exam}.json", "w", encoding="utf-8") as file:
        data_json = json.dumps(exam, indent=2, ensure_ascii=False)
        file.write(data_json)



path = "./cache/exam/exam.md"
id_exam = "pdf" 
id_subject = "toan"
name_exam = "Bộ đề mẫu PDF"
name_subject = "Toán"
class_exam = 12
duration = 45
created = "2026-08-01T08:00:00.000"
source = "/documents/pdf/pdf.pdf"


    
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