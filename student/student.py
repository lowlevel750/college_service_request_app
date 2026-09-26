from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from pymongo import MongoClient
from admin.auth import require_role

MONGO_URL = "mongodb://localhost:27017"
client = MongoClient(MONGO_URL)
db = client["CollegeServiceRequestDB"]
request_collection = db["service_requests"]

app = FastAPI(title="Student API")


class RequestCreate(BaseModel):
    category: str
    title: str
    description: str


class RequestUpdate(BaseModel):
    category: str
    title: str
    description: str


@app.post("/requests", tags=["Student/Faculty - Requests"])
def create_request(
    data: RequestCreate,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    now = datetime.utcnow()

    request_data = {
        "user_id": current_user["user_id"],
        "category": data.category,
        "title": data.title,
        "description": data.description,
        "status": "NEW",
        "assigned_to": None,
        "created_at": now,
        "updated_at": now
    }

    result = request_collection.insert_one(request_data)

    return {
        "message": "Request created successfully",
        "request_id": str(result.inserted_id),
        "status": "NEW"
    }


@app.get("/requests/my", tags=["Student/Faculty - Requests"])
def get_my_requests(
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    requests = request_collection.find({
        "user_id": current_user["user_id"]
    })

    result = []
    for request in requests:
        result.append({
            "id": str(request["_id"]),
            "category": request["category"],
            "title": request["title"],
            "description": request["description"],
            "status": request["status"],
            "assigned_to": request["assigned_to"],
            "created_at": str(request["created_at"]),
            "updated_at": str(request["updated_at"])
        })

    return result


@app.get("/requests/{request_id}", tags=["Student/Faculty - Requests"])
def get_request(
    request_id: str,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    request = request_collection.find_one({
        "_id": ObjectId(request_id),
        "user_id": current_user["user_id"]
    })

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return {
        "id": str(request["_id"]),
        "category": request["category"],
        "title": request["title"],
        "description": request["description"],
        "status": request["status"],
        "assigned_to": request["assigned_to"],
        "created_at": str(request["created_at"]),
        "updated_at": str(request["updated_at"])
    }


@app.put("/requests/{request_id}", tags=["Student/Faculty - Requests"])
def update_request(
    request_id: str,
    data: RequestUpdate,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.update_one(
        {
            "_id": ObjectId(request_id),
            "user_id": current_user["user_id"],
            "status": "NEW"
        },
        {
            "$set": {
                "category": data.category,
                "title": data.title,
                "description": data.description,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Request not found or cannot be updated"
        )

    return {"message": "Request updated successfully"}


@app.delete("/requests/{request_id}", tags=["Student/Faculty - Requests"])
def delete_request(
    request_id: str,
    current_user=Depends(require_role("STUDENT", "FACULTY"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.delete_one({
        "_id": ObjectId(request_id),
        "user_id": current_user["user_id"],
        "status": "NEW"
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Request not found or cannot be deleted"
        )

    return {"message": "Request deleted successfully"}
