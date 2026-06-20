# source .venv/bin/activate
# uvicorn main:app --reload

from fastapi import FastAPI
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
    return list_exams