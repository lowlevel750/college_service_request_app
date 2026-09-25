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

app = FastAPI(title="Staff API")


class StatusUpdate(BaseModel):
    status: str


class Assignment(BaseModel):
    staff_id: str


ALLOWED_STATUS = [
    "NEW",
    "ASSIGNED",
    "IN_PROGRESS",
    "ON_HOLD",
    "RESOLVED",
    "CLOSED",
    "COMPLETED"
]


@app.get("/staff/requests", tags=["Staff/Lead - Requests"])
def get_staff_requests(
    current_user=Depends(require_role("STAFF", "SERVICE_STAFF", "SERVICE_LEAD"))
):
    requests = request_collection.find()

    result = []
    for request in requests:
        result.append({
            "id": str(request["_id"]),
            "user_id": request["user_id"],
            "category": request["category"],
            "title": request["title"],
            "description": request["description"],
            "status": request["status"],
            "assigned_to": request["assigned_to"],
            "created_at": str(request["created_at"]),
            "updated_at": str(request["updated_at"])
        })

    return result


@app.get("/staff/requests/{request_id}", tags=["Staff/Lead - Requests"])
def get_staff_request(
    request_id: str,
    current_user=Depends(require_role("STAFF", "SERVICE_STAFF", "SERVICE_LEAD"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    request = request_collection.find_one({
        "_id": ObjectId(request_id)
    })

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return {
        "id": str(request["_id"]),
        "user_id": request["user_id"],
        "category": request["category"],
        "title": request["title"],
        "description": request["description"],
        "status": request["status"],
        "assigned_to": request["assigned_to"],
        "created_at": str(request["created_at"]),
        "updated_at": str(request["updated_at"])
    }


@app.put("/staff/requests/{request_id}/status", tags=["Staff/Lead - Requests"])
def update_request_status(
    request_id: str,
    data: StatusUpdate,
    current_user=Depends(require_role("STAFF", "SERVICE_STAFF", "SERVICE_LEAD"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    if data.status not in ALLOWED_STATUS:
        raise HTTPException(status_code=400, detail="Invalid status")

    result = request_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "status": data.status,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request status updated successfully"}


@app.put("/staff/requests/{request_id}/assign", tags=["Staff/Lead - Requests"])
def assign_request(
    request_id: str,
    data: Assignment,
    current_user=Depends(require_role("STAFF", "SERVICE_STAFF", "SERVICE_LEAD", "ADMIN"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.update_one(
        {"_id": ObjectId(request_id)},
        {
            "$set": {
                "assigned_to": data.staff_id,
                "status": "ASSIGNED",
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request assigned successfully"}


@app.delete("/staff/requests/{request_id}", tags=["Staff/Lead - Requests"])
def delete_staff_request(
    request_id: str,
    current_user=Depends(require_role("STAFF", "SERVICE_STAFF", "SERVICE_LEAD", "ADMIN"))
):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    result = request_collection.delete_one({
        "_id": ObjectId(request_id)
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"message": "Request deleted successfully"}
