from fastapi import APIRouter, Depends
from pydantic import BaseModel
from admin.db.category_db import category_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Categories"])


class CategoryCreate(BaseModel):
    name: str


@router.post("/categories")
def create_category(
    data: CategoryCreate,
    current_user=Depends(require_role("ADMIN"))
):
    result = category_collection.insert_one({"name": data.name})

    return {
        "message": "Category created successfully",
        "category_id": str(result.inserted_id)
    }
