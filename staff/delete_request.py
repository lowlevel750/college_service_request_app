from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from staff.db.service_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Staff/Lead - Requests"])


@router.delete("/staff/requests/{request_id}")
def delete_request(
    request_id: str,
    current_user=Depends(require_role("SERVICE_LEAD"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.delete_one({
        "_id": ObjectId(request_id)
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request deleted successfully"}
