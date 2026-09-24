from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
from student.db.request_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Student/Faculty - Requests"])


class RequestCreate(BaseModel):
    category: str
    title: str
    description: str


@router.post("/requests")
def create_request(
    data: RequestCreate,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    now = datetime.utcnow()

    request_data = {
        "user_id": current_user["user_id"],
        "category": data.category,
        "title": data.title,
        "description": data.description,
        "status": "NEW",
        "assigned_to": None,
        "created_at": now,
        "updated_at": now
    }

    result = request_collection.insert_one(request_data)

    return {
        "message": "Request created successfully",
        "request_id": str(result.inserted_id),
        "status": "NEW"
    }
