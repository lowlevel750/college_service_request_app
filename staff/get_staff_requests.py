from fastapi import APIRouter, Depends
from staff.db.service_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Staff/Lead - Requests"])


@router.get("/staff/requests")
def get_staff_requests(
    current_user=Depends(require_role("SERVICE_STAFF", "SERVICE_LEAD"))
):
    requests = request_collection.find()

    result = []

    for request in requests:
        result.append({
            "id": str(request["_id"]),
            "user_id": request["user_id"],
            "category": request["category"],
            "title": request["title"],
            "description": request["description"],
            "status": request["status"],
            "assigned_to": request["assigned_to"],
            "created_at": str(request["created_at"]),
            "updated_at": str(request["updated_at"])
        })

    return result
