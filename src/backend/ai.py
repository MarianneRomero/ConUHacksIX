import google.generativeai as genai
from datetime import datetime
from collections import Counter
from db import get_mood_entries_last_30days

prompts = {
    "Morning": "I just woke up, pretend you are my friend and ask me a short question about how my morning is going, what are my goals, etc. Dont add emojis",
    "Noon": "I just ate lunch, pretend you are my friend and ask me a short question about how my day is going so far, what I did, etc. Dont add emojis",
    "Evening": "It's evening now, pretend you are my friend and ask me a short question about how my day is going so far, my mood, etc. Dont add emojis",
    "Night": "Its nighttime, pretend you are my friend and ask me a short question about how my day went, reflections, random thoughtful questions, etc. Dont add emojis"
}


def call_gemini(user_prompt):
    genai.configure(api_key="AIzaSyBP7tOcTH0azlGYcWMjKx2FRk7CjRPzDGA")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_prompt)
    return response.text


def response_ai():
    return call_gemini("pretend you are my friend and confirm that you have received my text and saved it. Dont ask any questions")

def basic_prompt(time):
    return call_gemini(prompts[time])

def event_prompt(event):
    return call_gemini(f"I had {event} today, pretend you are my friend and ask me questions about how it went. Dont add emojis")

def mood_prompt():
    return call_gemini("Ask me a short question on how my mood was today")

def get_mood_prompt(mood):
    try:
        response = call_gemini(f"Here is what I'm feeling: {mood}. Out of the following emotions (happy, sad, angry, anxious, calm) which one am I feeling the most? Answer in 1 word")
        if response.strip():  # Check if response is not empty or just whitespace
            return response.strip()
        else:
            raise ValueError("Received an empty or invalid response from Gemini.")
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "happy"


def analyze_mood_data(user_email):
    mood_colors = {
        "happy": "#8884d8",
        "sad": "#83a6ed",
        "angry": "#8dd1e1",
        "anxious": "#a4de6c",
        "calm": "#82ca9d"
    }

    mood_entries = get_mood_entries_last_30days(user_email)
    if not mood_entries:
        print(f"No mood entries found for {user_email}.")
        return []

    mood_counts = Counter()

    for entry in mood_entries:
        mood = get_mood_prompt(entry["response"]).strip('\n').lower()
        if mood:  # Ensure mood is not None or empty
            mood_counts[mood] += 1
        else:
            print(f"Error processing mood entry for {entry}.")

    return [{"name": mood, "count": count, "fill": mood_colors[mood]} for mood, count in mood_counts.items()]


MOOD_DATA=analyze_mood_data('marianne.romero30@gmail.com')
