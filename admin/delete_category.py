from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from admin.db.category_db import category_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Categories"])


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    result = category_collection.delete_one(
        {"_id": ObjectId(category_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")

    return {"message": "Category deleted successfully"}
