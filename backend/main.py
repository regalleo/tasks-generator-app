from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import groq
import os
import json
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Tasks Generator API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
USE_DB = DATABASE_URL is not None

# In-memory storage (fallback when no database)
specs_db = {}

# SQLAlchemy setup (optional - for production)
if USE_DB:
    from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker
    
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False)
    Base = declarative_base()
    
    class SpecModel(Base):
        __tablename__ = "specs"
        
        id = Column(String(36), primary_key=True)
        timestamp = Column(Integer)
        form_data = Column(Text)  # JSON string
        tasks = Column(Text)  # JSON string
        
        def to_dict(self):
            return {
                "id": self.id,
                "timestamp": self.timestamp,
                "form_data": json.loads(self.form_data),
                "tasks": json.loads(self.tasks)
            }
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

# Models
class FeatureRequest(BaseModel):
    goal: str
    users: Optional[str] = ""
    constraints: Optional[str] = ""
    template: str = "web"

class Task(BaseModel):
    id: int
    text: str
    type: str
    group: str

class Spec(BaseModel):
    id: str
    timestamp: int
    form_data: FeatureRequest
    tasks: List[Task]

class SystemStatus(BaseModel):
    backend: str
    database: str
    llm: str

# Database helper functions
def save_spec_to_db(spec):
    """Save spec to database or memory"""
    if USE_DB:
        from sqlalchemy.orm import Session
        db = SessionLocal()
        try:
            db_spec = SpecModel(
                id=spec["id"],
                timestamp=spec["timestamp"],
                form_data=json.dumps(spec["form_data"]),
                tasks=json.dumps(spec["tasks"])
            )
            db.add(db_spec)
            db.commit()
        finally:
            db.close()
    else:
        specs_db[spec["id"]] = spec

def get_all_specs_from_db(limit=5):
    """Get all specs from database or memory"""
    if USE_DB:
        from sqlalchemy.orm import Session
        db = SessionLocal()
        try:
            specs = db.query(SpecModel).order_by(SpecModel.timestamp.desc()).limit(limit).all()
            return [s.to_dict() for s in specs]
        finally:
            db.close()
    else:
        specs_list = list(specs_db.values())
        specs_list.sort(key=lambda x: x["timestamp"], reverse=True)
        return specs_list[:limit]

def get_spec_from_db(spec_id):
    """Get single spec from database or memory"""
    if USE_DB:
        from sqlalchemy.orm import Session
        db = SessionLocal()
        try:
            s = db.query(SpecModel).filter(SpecModel.id == spec_id).first()
            return s.to_dict() if s else None
        finally:
            db.close()
    return specs_db.get(spec_id)

def delete_spec_from_db(spec_id):
    """Delete spec from database or memory"""
    if USE_DB:
        from sqlalchemy.orm import Session
        db = SessionLocal()
        try:
            db.query(SpecModel).filter(SpecModel.id == spec_id).delete()
            db.commit()
        finally:
            db.close()
    else:
        if spec_id in specs_db:
            del specs_db[spec_id]

# Routes
@app.get("/")
async def root():
    return {"message": "Tasks Generator API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/status")
async def get_status():
    # Check Groq API
    llm_status = "healthy"
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            llm_status = "error"
    except:
        llm_status = "error"
    
    # Check database
    db_status = "healthy" if USE_DB else "in-memory"
    
    return SystemStatus(
        backend="healthy",
        database=db_status,
        llm=llm_status
    )

@app.post("/api/generate")
async def generate_tasks(request: FeatureRequest):
    """Generate tasks using Groq API"""
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    client = groq.Groq(api_key=api_key)
    
    prompt = f"""You are a product and engineering expert. Generate a comprehensive list of user stories and engineering tasks for the following feature:

Goal: {request.goal}
Target Users: {request.users or 'General users'}
Constraints: {request.constraints or 'None specified'}
Template Type: {request.template}

Please generate:
1. 3-5 user stories (format: "As a [user], I want [goal] so that [benefit]")
2. 8-12 engineering tasks broken down by category (Frontend, Backend, Database, Testing, Deployment)

Also identify 2-3 key risks or unknowns.

Return your response in the following JSON format only, with no additional text:
{{
  "userStories": ["story1", "story2", ...],
  "tasks": {{
    "Frontend": ["task1", "task2", ...],
    "Backend": ["task1", "task2", ...],
    "Database": ["task1", "task2", ...],
    "Testing": ["task1", "task2", ...],
    "Deployment": ["task1", "task2", ...]
  }},
  "risks": ["risk1", "risk2", ...]
}}"""
    
    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000
        )
        
        content = chat_completion.choices[0].message.content
        
        # Extract JSON from response
        json_start = content.find('{')
        json_end = content.rfind('}') + 1
        json_str = content[json_start:json_end]
        
        parsed_data = json.loads(json_str)
        
        # Convert to flat task structure
        tasks = []
        task_id = 1
        
        # Add user stories
        for story in parsed_data.get("userStories", []):
            tasks.append({
                "id": task_id,
                "text": story,
                "type": "User Story",
                "group": "User Stories"
            })
            task_id += 1
        
        # Add engineering tasks
        for category, task_list in parsed_data.get("tasks", {}).items():
            for task in task_list:
                tasks.append({
                    "id": task_id,
                    "text": task,
                    "type": "Task",
                    "group": category
                })
                task_id += 1
        
        # Add risks
        for risk in parsed_data.get("risks", []):
            tasks.append({
                "id": task_id,
                "text": risk,
                "type": "Risk",
                "group": "Risks & Unknowns"
            })
            task_id += 1
        
        # Save spec
        spec_id = str(uuid.uuid4())
        spec = {
            "id": spec_id,
            "timestamp": int(datetime.now().timestamp() * 1000),
            "form_data": request.model_dump(),
            "tasks": tasks
        }
        save_spec_to_db(spec)
        
        return spec
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate tasks: {str(e)}")

@app.get("/api/specs")
async def get_specs():
    """Get last 5 specs"""
    return get_all_specs_from_db(limit=5)

@app.get("/api/specs/{spec_id}")
async def get_spec(spec_id: str):
    """Get specific spec by ID"""
    spec = get_spec_from_db(spec_id)
    if not spec:
        raise HTTPException(status_code=404, detail="Spec not found")
    return spec

@app.put("/api/specs/{spec_id}")
async def update_spec(spec_id: str, spec: Spec):
    """Update a spec"""
    existing = get_spec_from_db(spec_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Spec not found")
    
    updated_spec = spec.model_dump()
    save_spec_to_db(updated_spec)
    return updated_spec

@app.delete("/api/specs/{spec_id}")
async def delete_spec(spec_id: str):
    """Delete a spec"""
    delete_spec_from_db(spec_id)
    return {"message": "Spec deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
