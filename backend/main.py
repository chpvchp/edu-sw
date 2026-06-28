# source .venv/bin/activate
# uvicorn main:app --reload

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from core.database.conndb import ConnDB

db = ConnDB()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/backend-api/bai-tap")
def get_exams():
    list_exams = db.get_list_exam()
    if list_exams is None:
        raise HTTPException(status_code=404, detail="Not Found List Exams")
    return list_exams

@app.get("/backend-api/bai-tap/{id_exam}")
def get_info_exams(id_exam):
    info_exam = db.get_info_exam(id_exam)
    if info_exam is None:
        raise HTTPException(status_code=404, detail="Not Found Info Exam")
    return info_exam

@app.get("/backend-api/bai-tap/{id_exam}/questions")
def get_questions_in_exam_(id_exam):
    questions = db.get_questions_in_exam(id_exam)
    if questions is None:
        raise HTTPException(status_code=404, detail="Not Found Questions in Exam")
    return questions