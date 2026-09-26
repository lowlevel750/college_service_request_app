from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from bson import ObjectId
from pymongo import MongoClient
from admin.auth import hash_password, verify_password, create_token, require_role

MONGO_URL = "mongodb://localhost:27017"
client = MongoClient(MONGO_URL)
db = client["CollegeServiceRequestDB"]
user_collection = db["users"]
category_collection = db["service_categories"]

app = FastAPI(title="Admin API")


class LoginData(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "STUDENT"


class UserUpdate(BaseModel):
    name: str
    role: str


class CategoryCreate(BaseModel):
    name: str


class CategoryUpdate(BaseModel):
    name: str


@app.post("/login", tags=["Admin - Auth"])
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
        "role": user["role"],
        "name": user.get("name", ""),
        "email": user["email"],
        "user_id": str(user["_id"])
    }


@app.post("/register", tags=["Admin - Auth"])
def register_user(user: UserCreate):
    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

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


@app.get("/users", tags=["Admin - Users"])
def get_users(current_user=Depends(require_role("ADMIN", "SERVICE_LEAD", "STAFF"))):
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


@app.get("/users/{user_id}", tags=["Admin - Users"])
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


@app.put("/users/{user_id}", tags=["Admin - Users"])
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


@app.delete("/users/{user_id}", tags=["Admin - Users"])
def delete_user(user_id: str, current_user=Depends(require_role("ADMIN"))):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = user_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}


@app.post("/categories", tags=["Admin - Categories"])
def create_category(
    category: CategoryCreate,
    current_user=Depends(require_role("ADMIN"))
):
    category_data = {
        "name": category.name
    }

    result = category_collection.insert_one(category_data)

    return {
        "message": "Category created successfully",
        "category_id": str(result.inserted_id)
    }


@app.get("/categories", tags=["Admin - Categories"])
def get_categories(
    current_user=Depends(require_role("ADMIN", "STUDENT", "FACULTY", "STAFF", "SERVICE_STAFF", "SERVICE_LEAD"))
):
    categories = category_collection.find()

    result = []
    for category in categories:
        result.append({
            "id": str(category["_id"]),
            "name": category["name"]
        })

    return result


@app.get("/categories/{category_id}", tags=["Admin - Categories"])
def get_category(
    category_id: str,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    category = category_collection.find_one({"_id": ObjectId(category_id)})

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return {
        "id": str(category["_id"]),
        "name": category["name"]
    }


@app.put("/categories/{category_id}", tags=["Admin - Categories"])
def update_category(
    category_id: str,
    category: CategoryUpdate,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    result = category_collection.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": {"name": category.name}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")

    return {"message": "Category updated successfully"}


@app.delete("/categories/{category_id}", tags=["Admin - Categories"])
def delete_category(
    category_id: str,
    current_user=Depends(require_role("ADMIN"))
):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    result = category_collection.delete_one({"_id": ObjectId(category_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")

    return {"message": "Category deleted successfully"}
