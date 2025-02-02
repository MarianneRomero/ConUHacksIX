from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
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


def save_entry(user_email, prompt, response, type="normal"):
    entry_data = {
        "user_id": user_email,
        "prompt": prompt,
        "response": response,
        "date": datetime.now().strftime('%Y-%m-%d'),
        "time": datetime.now().strftime('%H'),
        "type": type
    }
    entries_collection.insert_one(entry_data)
    return "Entry saved successfully!"


#Add sorting to user time
# Filter by user_email, date
def get_user_entries(user_email):
    entries = list(entries_collection.find({"user_id": user_email}).sort("date",-1))
    return entries

def get_user_entries_for_date(user_email, date):
    entries = list(entries_collection.find({"user_id": user_email, "date": date}).sort("date",-1))
    for entry in entries:
        entry['_id'] = str(entry['_id'])  # Convert ObjectId to string
        print(entry)
    return entries

def get_normal_entries_for_date(user_email, date):
    entries = list(entries_collection.find({"user_id": user_email, "date": date, "type": "normal"}).sort("date",-1))
    for entry in entries:
        entry['_id'] = str(entry['_id'])  # Convert ObjectId to string
        print(entry)
    return entries

def get_event_entries_for_date(user_email, date):
    entries = list(entries_collection.find({"user_id": user_email, "date": date, "type": "event"}).sort("date",-1))
    for entry in entries:
        entry['_id'] = str(entry['_id'])  # Convert ObjectId to string
        print(entry)
    return entries

if __name__ == "__main__":
    # Example usage
    user_email = "glzvl97@gmail.com"  
    prompt = "How was your day?"  
    response = "Today was a tough day, but I learned a lot."

    print(save_entry(user_email, prompt, response,))
    print(get_user_entries(user_email))
