from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from student.db.request_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Student/Faculty - Requests"])


@router.get("/requests/{request_id}")
def get_request(
    request_id: str,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    request = request_collection.find_one({
        "_id": ObjectId(request_id),
        "user_id": current_user["user_id"]
    })

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return {
        "id": str(request["_id"]),
        "category": request["category"],
        "title": request["title"],
        "description": request["description"],
        "status": request["status"],
        "assigned_to": request["assigned_to"],
        "created_at": str(request["created_at"]),
        "updated_at": str(request["updated_at"])
    }
