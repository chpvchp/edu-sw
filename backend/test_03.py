import os
import re
import json

def clean_line(line):
    return line.strip()

def is_question(line):
    return line.startswith("Câu")

def is_answer(line):
    return re.match(r"^[A-D]\.", line)

def parse():
    data = []
    id_question = 0
    id_answer = 0
    
    with open("./backend/a.md", "r", encoding="utf-8") as file:
        for line in file:
            line = clean_line(line)

            if is_question(line):
                
                current_question = {
                    "id_question": id_question,
                    "question": line,
                    "answers": []
                }
                
                id_question += 1
                data.append(current_question)
            
            elif is_answer(line) and current_question:
                answer = {
                    "id_answer": id_answer,
                    "answer": line
                }
                id_answer += 1
                current_question["answers"].append(answer)
    return data


data = {
    "questions": parse()
}
data = json.dumps(data, indent=2, ensure_ascii=False)
print(data)