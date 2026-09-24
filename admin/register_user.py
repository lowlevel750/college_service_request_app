from fastapi import APIRouter
from pydantic import BaseModel
from admin.db.user_db import user_collection
from admin.auth import hash_password

router = APIRouter(tags=["Admin - Users"])


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str


@router.post("/register")
def register_user(user: UserCreate):
    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        return {"message": "User already exists"}

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "role": user.role
    }

    result = user_collection.insert_one(user_data)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }
