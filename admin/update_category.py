from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from admin.db.category_db import category_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Categories"])


class CategoryUpdate(BaseModel):
    name: str


@router.put("/categories/{category_id}")
def update_category(
    category_id: str,
    data: CategoryUpdate,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    result = category_collection.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": {"name": data.name}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")

    return {"message": "Category updated successfully"}
