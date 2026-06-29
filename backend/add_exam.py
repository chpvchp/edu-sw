from core.database.conndb import ConnDB
import json
from datetime import datetime

db = ConnDB()

def add_exam(name_exam):
    with open(f"./backend/json/{name_exam}.json", "r", encoding="utf-8") as file_json:
        exam = json.load(file_json)
        
        id_exam = exam["id_exam"]
        id_subject = exam["id_subject"]
        name_exam = exam["name_exam"]
        duration = exam["duration"]
        questions = exam["questions"]
        created = datetime.now()
        
        db.add_exam(
            id_exam=id_exam,
            id_subject=id_subject,
            name_exam=name_exam,
            duration=duration,
            questions=questions,
            created=created
        )

add_exam()