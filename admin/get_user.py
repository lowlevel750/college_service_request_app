from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from admin.db.user_db import user_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Users"])


@router.get("/users/{user_id}")
def get_user(user_id: str, current_user=Depends(require_role("ADMIN"))):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }
