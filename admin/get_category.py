from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from admin.db.category_db import category_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Categories"])


@router.get("/categories/{category_id}")
def get_category(
    category_id: str,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    category = category_collection.find_one(
        {"_id": ObjectId(category_id)}
    )

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return {
        "id": str(category["_id"]),
        "name": category["name"]
    }
