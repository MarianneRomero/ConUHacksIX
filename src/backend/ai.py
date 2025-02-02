import google.generativeai as genai
from datetime import datetime

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


def response():
    return call_gemini("pretend you are my friend and confirm that you have received my text and saved it. Dont ask any questions")


def basic_prompt(time):
    return call_gemini(prompts[time])


def event_prompt(event):
    return call_gemini(f"I had {event} today, pretend you are my friend and ask me questions about how it went. Dont add emojis")
