from fastapi import APIRouter, Depends
from student.db.request_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Student/Faculty - Requests"])


@router.get("/requests/my")
def get_requests(
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    requests = request_collection.find({
        "user_id": current_user["user_id"]
    })

    result = []

    for request in requests:
        result.append({
            "id": str(request["_id"]),
            "category": request["category"],
            "title": request["title"],
            "description": request["description"],
            "status": request["status"],
            "assigned_to": request["assigned_to"],
            "created_at": str(request["created_at"]),
            "updated_at": str(request["updated_at"])
        })

    return result
