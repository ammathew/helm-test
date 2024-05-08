from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

import threading
import time


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Case(BaseModel):
    id: str
    created_at: datetime
    status: str

def process_case(case: Case):
    time.sleep(10)
    case.status = "processing"
    case.summary = "Processing case..."
    time.sleep(20)
    case.status = "complete"
    case.summary = "Case processed successfully"
    case.steps = ["Step 1", "Step 2", "Step 3"]

cases = []

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/cases", response_model=Case)
async def create_case():
    case_id = str(uuid.uuid4())
    case = Case(id=case_id, created_at=datetime.now(), status="submitted")
    cases.append(case)
    threading.Thread(target=process_case, args=(case,)).start()
    return case

@app.get("/cases", response_model=List[Case])
async def get_cases():
    return cases

@app.get("/cases/{case_id}", response_model=Case)
async def get_case(case_id: str):
    for case in cases:
        if case.id == case_id:
            return case
    return None