from fastapi import APIRouter, Depends
from admin.db.category_db import category_collection
from admin.auth import require_role

router = APIRouter(tags=["Admin - Categories"])


@router.get("/categories")
def get_categories(current_user=Depends(require_role("ADMIN"))):
    categories = category_collection.find()

    result = []

    for category in categories:
        result.append({
            "id": str(category["_id"]),
            "name": category["name"]
        })

    return result
