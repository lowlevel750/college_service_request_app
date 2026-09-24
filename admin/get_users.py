from fastapi import APIRouter, Depends
from admin.db.user_db import user_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Users"])


@router.get("/users")
def get_users(current_user=Depends(require_role("ADMIN"))):
    users = user_collection.find()

    result = []

    for user in users:
        result.append({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        })

    return result
