import json

results = []
id_question = 0
id_answer = 0

with open("./backend/a.md", "r", encoding="utf-8") as file:
    for _ in range(70):
        line = file.readline()
        if _ % 10 == 0:
            id_question += 1
            question = {
                "id_question": id_question,
                "question": line,
                "answers": []
            }
            results.append(question)
            continue
        elif _ % 2 == 0:
            id_answer += 1
            answer = {
                "id_answer": id_answer,
                "answer": line
            }
            question["answers"].append(answer)
            
print(results)