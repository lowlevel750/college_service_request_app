from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from staff.db.service_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Staff/Lead - Requests"])


class StatusUpdate(BaseModel):
    status: str


ALLOWED_STATUS = [
    "ASSIGNED",
    "IN_PROGRESS",
    "ON_HOLD",
    "RESOLVED",
    "CLOSED"
]


@router.put("/staff/requests/{request_id}/status")
def update_request_status(
    request_id: str,
    data: StatusUpdate,
    current_user=Depends(
        require_role("SERVICE_STAFF", "SERVICE_LEAD")
    )
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if data.status not in ALLOWED_STATUS:
        raise HTTPException(status_code=400, detail="Invalid status")

    result = request_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": data.status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request status updated successfully"}
