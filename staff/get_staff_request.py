from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from staff.db.service_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Staff/Lead - Requests"])


@router.get("/staff/requests/{request_id}")
def get_staff_request(
    request_id: str,
    current_user=Depends(require_role("SERVICE_STAFF", "SERVICE_LEAD"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    request = request_collection.find_one({
        "_id": ObjectId(request_id)
    })

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return {
        "id": str(request["_id"]),
        "user_id": request["user_id"],
        "category": request["category"],
        "title": request["title"],
        "description": request["description"],
        "status": request["status"],
        "assigned_to": request["assigned_to"],
        "created_at": str(request["created_at"]),
        "updated_at": str(request["updated_at"])
    }
