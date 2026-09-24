from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)
db = client["CollegeServiceRequestDB"]
category_collection = db["service_categories"]
