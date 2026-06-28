import os
import re
import json
import uuid

def clean_line(line):
    return line.strip()

def is_question(line):
    return line.startswith("Câu")

def is_answer_four_choice(line):
    return re.match(r"^[A-D]\.", line)

def is_path_image(line):
    return line.startswith("![](images/")

def is_correct(line):
    if "ĐápÁnĐúng" not in line:
        return False
    else:
        return True

def parse(name_exam, id_subject, duration):
    questions = []
    exam = {
        "id_exam": uuid.uuid4().hex,
        "id_subject": id_subject,
        "name_exam": name_exam,
        "duration": duration,
        "questions": questions
    }
    
    with open(f"./.data/{name_exam}/{name_exam}.md", "r", encoding="utf-8") as file:
        for line in file:
            line = clean_line(line)

            if is_question(line):
                id_question = uuid.uuid4().hex
                
                current_question = {
                    "id_question": id_question,
                    "question": line,
                    "type_question": "",
                    "path_images": "",
                    "answers": [],
                    "results": {
                        "explain": "",
                        "correct_answer": ""
                    }
                }
                
                
                questions.append(current_question)
                
            elif is_path_image(line) and current_question:
                current_question["path_images"] = line[4:-1]
                
            
            elif is_answer_four_choice(line) and current_question:
                id_answer = uuid.uuid4().hex
                
                if current_question["type_question"] != "four_choice":
                    current_question["type_question"] = "four_choice"
                
                if is_correct(line):
                    current_question["results"]["correct_answer"] = id_answer
                    line = line.replace("ĐápÁnĐúng", "")
                    line = clean_line(line)
                    
                answer = {
                    "id_answer": id_answer,
                    "answer": line
                }
                current_question["answers"].append(answer)
                
    with open("./backend/json/exam.json", "w", encoding="utf-8") as file:
        data_json = json.dumps(exam, indent=2, ensure_ascii=False)
        file.write(data_json)
        
        
parse(
    name_exam="Tính Đơn Điệu Và Cực Trị Của Hàm Số",
    id_subject=1,
    duration=30
)