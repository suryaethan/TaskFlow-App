"""
TaskFlow-App - FastAPI Backend
Full-Stack Task Management Application
Author: suryaethan
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import jwt
import bcrypt

# ── App Setup ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="TaskFlow API",
    description="Full-Stack Task Management REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "taskflow-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
security = HTTPBearer()

# ── In-Memory Store (Replace with PostgreSQL in production) ───────────────────
users_db: dict = {}
tasks_db: dict = {}

# ── Pydantic Models ───────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: str
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str
    password: str

class Task(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    priority: Optional[str] = "medium"  # low | medium | high
    status: Optional[str] = "todo"      # todo | in_progress | done
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None

# ── Auth Helpers ──────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id or user_id not in users_db:
            raise HTTPException(status_code=401, detail="Invalid token")
        return users_db[user_id]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Auth Routes ───────────────────────────────────────────────────────────────
@app.post("/api/auth/register", status_code=201)
def register(body: UserRegister):
    if any(u["email"] == body.email for u in users_db.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "id": user_id,
        "username": body.username,
        "email": body.email,
        "password": hash_password(body.password),
        "created_at": datetime.utcnow().isoformat(),
    }
    token = create_access_token({"user_id": user_id})
    return {"message": "User registered", "token": token, "username": body.username}

@app.post("/api/auth/login")
def login(body: UserLogin):
    user = next((u for u in users_db.values() if u["email"] == body.email), None)
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"user_id": user["id"]})
    return {"token": token, "username": user["username"]}

# ── Task Routes ───────────────────────────────────────────────────────────────
@app.get("/api/tasks", response_model=List[dict])
def get_tasks(current_user=Depends(get_current_user)):
    user_tasks = [
        t for t in tasks_db.values() if t["user_id"] == current_user["id"]
    ]
    return sorted(user_tasks, key=lambda x: x["created_at"], reverse=True)

@app.post("/api/tasks", status_code=201)
def create_task(body: Task, current_user=Depends(get_current_user)):
    task_id = str(uuid.uuid4())
    task = {
        "id": task_id,
        "user_id": current_user["id"],
        "title": body.title,
        "description": body.description,
        "priority": body.priority,
        "status": body.status,
        "due_date": body.due_date,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    tasks_db[task_id] = task
    return task

@app.put("/api/tasks/{task_id}")
def update_task(task_id: str, body: TaskUpdate, current_user=Depends(get_current_user)):
    task = tasks_db.get(task_id)
    if not task or task["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Task not found")
    updates = body.dict(exclude_none=True)
    task.update(updates)
    task["updated_at"] = datetime.utcnow().isoformat()
    return task

@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, current_user=Depends(get_current_user)):
    task = tasks_db.get(task_id)
    if not task or task["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks_db[task_id]

# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "app": "TaskFlow API", "version": "1.0.0"}
