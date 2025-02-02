import os
from openai import OpenAI
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from datetime import datetime
load_dotenv()

uri = "mongodb+srv://glzvl97:Glzvl97Lock133557@cluster0.tovyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client_mongo = MongoClient(uri, server_api=ServerApi('1'))

db = client_mongo.digital_diary  

prompts_collection = db.prompts
entries_collection = db.entries
users_collection = db.users

try:
    client_mongo.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")


def save_entry(user_id, prompt, response):
    entry_data = {
        "user_id": user_id,
        "prompt_id": prompt,
        "response": response,
        "created_at": datetime.now()
    }
    entries_collection.insert_one(entry_data)
    return "Entry saved successfully!"

if __name__ == "__main__":
    # Example usage
    user_id = "65bf4c1234abcd5678ef9012"  
    prompt = "65bf4c9876efabcd12345678"  
    response = "Today was a tough day, but I learned a lot."

    print(save_entry(user_id, prompt, response))

def get_user_entries(user_id):
    entries = list(entries_collection.find({"user_id": ObjectId(user_id)}))
    return entries

if __name__ == "__main__":
    user_id = "65bf4c1234abcd5678ef9012"
    print(get_user_entries(user_id))
