from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

import threading
import time

import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cases = {}

class Case(BaseModel):
    id: str
    procedure_name: Optional[str] = None
    is_met: Optional[bool] = None
    cpt_codes: Optional[List[str]] = None
    created_at: datetime
    status: str
    summary: Optional[str] = None
    steps: Optional[List[dict]] = None
    elapsed_time: Optional[float] = None

def load_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def update_case_from_json(case: Case, file_path: str):
    response = load_json(file_path)
    case.procedure_name = response['procedure_name']
    case.status = response['status']
    case.is_met = response['is_met']
    case.cpt_codes = response['cpt_codes']
    case.steps = response['steps']
    case.summary = response['summary']

def process_case(case: Case):
    time.sleep(1)
    update_case_from_json(case, '../assets/response-1.json')
    cases[case.id] = case
    time.sleep(1)
    update_case_from_json(case, '../assets/response-2.json')
    cases[case.id] = case
    time.sleep(3)
    update_case_from_json(case, '../assets/response-3.json')
    cases[case.id] = case


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/cases", response_model=Case)
async def create_case():
    case_id = str(uuid.uuid4())
    case = Case(id=case_id, created_at=datetime.now(), status="submitted")
    cases[case_id] = case
    threading.Thread(target=process_case, args=(case,)).start()
    return case

@app.get("/cases", response_model=List[Case])
async def get_cases():
    for case in cases.values():
        now = datetime.now()
        elapsed_time = now - case.created_at
        case.elapsed_time = elapsed_time.total_seconds()
    return list(cases.values())

@app.get("/cases/{case_id}", response_model=Case)
async def get_case(case_id: str):
    case = cases.get(case_id)
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    
    now = datetime.now()
    elapsed_time = now - case.created_at
    case.elapsed_time = elapsed_time.total_seconds()

    return case