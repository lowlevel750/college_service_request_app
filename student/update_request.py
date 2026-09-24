from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from student.db.request_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Student/Faculty - Requests"])


class RequestUpdate(BaseModel):
    category: str
    title: str
    description: str


@router.put("/requests/{request_id}")
def update_request(
    request_id: str,
    data: RequestUpdate,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "user_id": current_user["user_id"],
            "status": "NEW"
        },
        {
            "$set": {
                "category": data.category,
                "title": data.title,
                "description": data.description,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Request not found or cannot be updated"
        )

    return {"message": "Request updated successfully"}
