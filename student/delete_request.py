from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from student.db.request_db import request_collection
from admin.auth import require_role

router = APIRouter(tags=["Student/Faculty - Requests"])


@router.delete("/requests/{request_id}")
def delete_request(
    request_id: str,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.delete_one({
        "_id": ObjectId(request_id),
        "user_id": current_user["user_id"],
        "status": "NEW"
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Request not found or cannot be deleted"
        )

    return {"message": "Request deleted successfully"}
