import google.generativeai as genai
from datetime import datetime

def call_gemini(user_prompt):
    genai.configure(api_key="AIzaSyBP7tOcTH0azlGYcWMjKx2FRk7CjRPzDGA")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_prompt)
    print(response.text)
    print("----")

def get_time_of_day():
    # Get the current time
    now = datetime.now()
    current_hour = now.hour  # Extract the hour (0-23)

    # Determine the time of day
    if 5 <= current_hour < 12:
        return "Morning"
    elif 12 <= current_hour < 17:
        return "Noon"
    elif 17 <= current_hour < 21:
        return "Evening"
    else:
        return "Night"

def basic_prompt(time):
    call_gemini(prompts[time])


def event_prompt(event):
    call_gemini(f"I had {event} today, pretend you are my friend and ask me questions about how it went")


prompts = {
    "Morning": "I just woke up, pretend you are my friend and ask me a short question about how my morning is going, what are my goals, etc",
    "Noon": "Just ate lunch, pretend you are my friend and ask me a short question about how my day is going so far, what I did, etc",
    "Evening": "It's evening now, pretend you are my friend and ask me a short question about how my day is going so far, my mood, etc",
    "Night": "Its nighttime, pretend you are my friend and ask me a short question about how my day went, reflections, random deep questions, etc"
}




basic_prompt("Night")
event_prompt("Hackathon")
