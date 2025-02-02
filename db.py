import os
from openai import OpenAI
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import google.generativeai as genai
from datetime import datetime
from ai import call_gemini, get_time_of_day, basic_prompt, event_prompt 

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


def save_entry(user_email, prompt, response, type="normal", date=None, time=None):
    if date is None:
        date = datetime.now().strftime('%Y-%m-%d')
    if time is None:
        time = datetime.now().strftime('%H:%M')  

    entry_data = {
        "user_id": user_email,
        "prompt": prompt,
        "response": response,
        "date": datetime.now().strftime('%Y-%m-%d'),
        "time": datetime.now().strftime('%H:%M'),
        "type": type
    }
    entries_collection.insert_one(entry_data)
    return "Entry saved successfully!"

def get_user_entries(user_email):
    entries = list(entries_collection.find({"user_id": user_email}).sort("date",-1))
    return entries

if __name__ == "__main__":
    entries = [
        ("marianne.romero30@gmail.com", 
            "Hey, how was you overall mood today?", 
            "Hi, I felt great today!! Had fun!",
            "mood", "2025-01-25", "20:30"), 
        ("marianne.romero30@gmail.com", 
            "Hey, how was you overall mood today?", 
            "Hi, I felt a little sad.. its ok tho",
            "mood", "2025-01-27", "20:30"), 
        ("marianne.romero30@gmail.com", 
            "Hey, how was you overall mood today?", 
            "Hi, I was so angry because I dropped my icecream",
            "mood", "2025-01-26", "14:30")
    ]

    # Pass all arguments dynamically, allowing the function to handle defaults
    for entry in entries:
        print(save_entry(*entry))

