from typing import Dict, List
from pydantic import BaseModel

class FourChoice(BaseModel):
    type: str
    answer: str
    
class TrueFalse(BaseModel):
    type: str
    true_answer: List[str]
    false_answer: List[str]
    
class ShortAnswer(BaseModel):
    type: str
    answer: float
    
TypeQuestionAnswer = FourChoice | TrueFalse | ShortAnswer

class SubmitQuestionAnswer(BaseModel):
    id_exam: str
    results: Dict[str, TypeQuestionAnswer]