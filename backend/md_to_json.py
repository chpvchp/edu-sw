#!/usr/bin/env python3
# chmod +x md_to_json.py

import os
import re
import json
import uuid
import argparse

params = argparse.ArgumentParser()
params.add_argument("name", type=str)
params.add_argument("id_sub", type=int)
params.add_argument("duration", type=int)
args = params.parse_args()

def clean_line(line):
    return line.strip()

def is_question(line):
    return line.startswith("Câu")

def is_answer_four_choice(line):
    return re.match(r"^[A-D]\.", line)

def is_answer_true_false(line):
    return re.match(r"^[a-d]\)", line)

def is_answer_short_answer(line):
    return line.startswith("Đáp án là:")

def is_path_image(line):
    return line.startswith("![](images/")

def is_correct_four_choice(line):
    if "ĐápÁnĐúng" not in line:
        return False
    else:
        return True

def parse(name_exam, id_subject, duration):
    questions = []
    current_question = None
    order = 1
    
    exam = {
        "id_exam": uuid.uuid4().hex,
        "id_subject": id_subject,
        "name_exam": name_exam,
        "duration": duration,
        "questions": questions
    }
    
    with open(f"./backend/data/{name_exam}/{name_exam}.md", "r", encoding="utf-8") as file:
        for line in file:
            line = clean_line(line)

            if is_question(line):
                id_question = uuid.uuid4().hex
                
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
                
            elif is_path_image(line) and current_question:
                current_question["path_images"] = f"data/{name_exam}/" + line[4:-1]
                
            
            elif is_answer_four_choice(line) and current_question:
                id_answer = uuid.uuid4().hex
                
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
                id_answer = uuid.uuid4().hex
                
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
                
                
    with open(f"./backend/json/{name_exam}.json", "w", encoding="utf-8") as file:
        data_json = json.dumps(exam, indent=2, ensure_ascii=False)
        file.write(data_json)
        
        
parse(
    name_exam=args.name,
    id_subject=args.id_sub,
    duration=args.duration
)