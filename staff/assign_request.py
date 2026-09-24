from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from staff.db.service_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Staff/Lead - Requests"])


class Assignment(BaseModel):
    staff_id: str


@router.put("/staff/requests/{request_id}/assign")
def assign_request(
    request_id: str,
    data: Assignment,
    current_user=Depends(require_role("SERVICE_LEAD"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "assigned_to": data.staff_id,
                "status": "ASSIGNED",
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request assigned successfully"}
