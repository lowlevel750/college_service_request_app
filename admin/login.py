from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from admin.db.user_db import user_collection
from admin.auth import verify_password, create_token

router = APIRouter(tags=["Authentication"])


class LoginData(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginData):
    user = user_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({
        "user_id": str(user["_id"]),
        "role": user["role"]
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"]
    }
