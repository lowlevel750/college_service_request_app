from pymongo import MongoClient
from admin.auth import hash_password

MONGO_URL = "mongodb://localhost:27017"
client = MongoClient(MONGO_URL)
db = client["CollegeServiceRequestDB"]

users_col = db["users"]
categories_col = db["service_categories"]

test_users = [
    {
        "name": "Mihir",
        "email": "mihir@gmail.com",
        "password": hash_password("123456"),
        "role": "STUDENT"
    },
    {
        "name": "Faculty User",
        "email": "faculty@gmail.com",
        "password": hash_password("123456"),
        "role": "FACULTY"
    },
    {
        "name": "Staff User",
        "email": "staff@gmail.com",
        "password": hash_password("123456"),
        "role": "STAFF"
    },
    {
        "name": "Lead User",
        "email": "lead@gmail.com",
        "password": hash_password("123456"),
        "role": "SERVICE_LEAD"
    },
    {
        "name": "Admin User",
        "email": "admin@gmail.com",
        "password": hash_password("admin123"),
        "role": "ADMIN"
    }
]

default_categories = [
    {"name": "Bonafide Certificate"},
    {"name": "ID Card Replacement"},
    {"name": "Lab Equipment Issue"},
    {"name": "Library Clearance"},
    {"name": "Hostel Maintenance"},
    {"name": "WiFi / Network Support"}
]

def seed():
    for u in test_users:
        existing = users_col.find_one({"email": u["email"]})
        if not existing:
            users_col.insert_one(u)
        else:
            users_col.update_one(
                {"email": u["email"]},
                {"$set": {"password": u["password"], "role": u["role"], "name": u["name"]}}
            )

    for cat in default_categories:
        existing = categories_col.find_one({"name": cat["name"]})
        if not existing:
            categories_col.insert_one(cat)

if __name__ == "__main__":
    seed()
