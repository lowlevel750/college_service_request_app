from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from admin.db.user_db import user_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Users"])


@router.delete("/users/{user_id}")
def delete_user(user_id: str, current_user=Depends(require_role("ADMIN"))):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = user_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
