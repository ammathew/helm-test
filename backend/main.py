from fastapi import FastAPI
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
    created_at: datetime
    status: str
    summary: Optional[str] = None
    steps: Optional[List[str]] = None


def load_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def update_case_from_json(case: Case, file_path: str):
    response = load_json(file_path)
    case.status = response['status']
    case.summary = response['summary']
    case.steps = response['steps']

def process_case(case: Case):
    time.sleep(10)
    update_case_from_json(case, '../assets/response-1.json')
    print(case)
    cases[case.id] = case
    time.sleep(10)
    update_case_from_json(case, '../assets/response-2.json')
    print(case)
    cases[case.id] = case
    time.sleep(30)
    update_case_from_json(case, '../assets/response-3.json')
    print(case)
    cases[case.id] = case


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/cases", response_model=Case)
async def create_case():
    case_id = '891a_6fbl_87d1_4326'
    case = Case(id=case_id, created_at=datetime.now(), status="submitted")
    cases[id] = case
    threading.Thread(target=process_case, args=(case,)).start()
    return case

@app.get("/cases", response_model=List[Case])
async def get_cases():
    return list(cases.values())

@app.get("/cases/{case_id}", response_model=Case)
async def get_case(case_id: str):
    for case in cases:
        if case.id == case_id:
            return case
    return None