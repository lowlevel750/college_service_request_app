from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from admin.db.user_db import user_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Users"])


class UserUpdate(BaseModel):
    name: str
    role: str


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    data: UserUpdate,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"name": data.name, "role": data.role}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}
