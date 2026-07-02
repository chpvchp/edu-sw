# source .venv/bin/activate
# uvicorn main:app --reload

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.database.conndb import ConnDB
from core.type.type import SubmitQuestionAnswer

db = ConnDB()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/data", StaticFiles(directory="data"), name="data")

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

@app.post("/backend-api/submit")
def post_submit_exam(student_submit: SubmitQuestionAnswer):
    correct_results = {}
    questions = db.get_full_question_in_exam(id_exam=student_submit.id_exam).get("questions")
    
    num_questions = len(questions)
    
    for question in questions:
        correct_results[question.get("id_question")] = {
            "type": question.get("type_question"),
            "results": question.get("results")
        }
            
    score = 0
    score_on_number = 10 / num_questions
    
    student_results = student_submit.results
    
    for id_question_student in student_results:
        result = student_results[id_question_student]
        if result.type == "four_choice":
            if result.answer == correct_results[id_question_student]["results"]["correct_answer"]:
                score += score_on_number
        
        elif result.type == "true_false":
            score_on_true_false = score_on_number / 4
            
            for true_answer in result.true_answer:
                if true_answer in correct_results[id_question_student]["results"]["true_answer"]:
                    score += score_on_true_false
                    
            for false_answer in result.false_answer:
                if false_answer in correct_results[id_question_student]["results"]["false_answer"]:
                    score += score_on_true_false
                
        
        elif result.type == "short_answer":
            if result.answer == float(correct_results[id_question_student]["results"]["short_answer"]):
                score += score_on_number
                
    print(score)
    