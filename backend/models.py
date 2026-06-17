import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

# Initialize MongoDB Client
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client.get_database("acne_ai_db")

users_collection = db["users"]
histories_collection = db["histories"]

def serialize_doc(doc):
    """Helper function to convert MongoDB _id to string id"""
    if not doc:
        return None
    
    # Create a copy to avoid mutating the original
    serialized = dict(doc)
    if '_id' in serialized:
        serialized['id'] = str(serialized['_id'])
        del serialized['_id']
        
    return serialized
