from datetime import datetime, timedelta
from flask import Flask, request
import pytz
from twilio.twiml.messaging_response import MessagingResponse
import os
import json
from flask import Flask, render_template, redirect, request, session, url_for, jsonify
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from sending_texts import send_message
from ai import event_prompt, basic_prompt, response
from flask_cors import CORS 
from db import save_entry, get_user_entries_for_date

scheduler = BackgroundScheduler()
app = Flask(__name__)
CORS(app)

app.secret_key = os.urandom(24)
CLIENT_SECRETS_FILE = "credentials_google_auth.json"
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'
REDIRECT_URI = 'https://localhost:5000/oauth2callback' 

LAST_MESSAGE_SENT = ""
LAST_MESSAGE_SENT_TYPE = "normal"

@app.route('/')
def index():
    # Check if the user is already authenticated
    if 'credentials' in session:
        return render_template('index.html', logged_in=True)
    return render_template('index.html', logged_in=False)


@app.route('/authorize')
def authorize():
    # If credentials already exist, no need to log in again
    # if 'credentials' in session:
    #     return redirect(url_for('get_calendar_events'))
    
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, SCOPES)
    flow.redirect_uri = REDIRECT_URI
    
    # Get authorization URL and state, store state in session
    authorization_url, state = flow.authorization_url(
        access_type='offline', include_granted_scopes='true')
    
    session['state'] = state  # Store the state in the session
    return redirect(authorization_url)


@app.route('/oauth2callback')
def oauth2callback():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=url_for('oauth2callback', _external=True)
    )
    flow.fetch_token(authorization_response=request.url)
    
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)  # Save as dictionary
    return redirect('http://localhost:3000/')


@app.route('/get_calendar_events', methods=['GET'])
def get_calendar_events():
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    # Convert expiry back to datetime if it exists
    creds_data = session['credentials']
    if creds_data.get('expiry'):
        creds_data['expiry'] = datetime.fromisoformat(creds_data['expiry'])
    
    # Reconstruct credentials from session
    credentials = Credentials(**creds_data)
    
    # Refresh if expired
    if credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
        session['credentials'] = credentials_to_dict(credentials)
    
    # Build the Calendar API service
    service = build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

    # Define the time range for today
    tz = pytz.timezone('UTC') 
    now = datetime.now(tz)
    start_of_day = datetime(year=now.year, month=now.month, day=now.day, tzinfo=tz)
    end_of_day = start_of_day + timedelta(days=1)
    # Convert to ISO format
    time_min = start_of_day.isoformat()
    time_max = end_of_day.isoformat()

    # Fetch today's events
    events_result = service.events().list(
        calendarId='primary', timeMin=time_min, timeMax=time_max,
        maxResults=10, singleEvents=True, orderBy='startTime',
        fields='items(summary,start,end,location,status)'
    ).execute()
    
    events = events_result.get('items', [])
    schedule_messages(events)
    return jsonify(events)

@app.route('/getEvents', methods=['GET'])
def getEventsWithDate():
    date = request.args.get('date')
    events = get_user_entries_for_date("marianne.romero30@gmail.com", date)

def credentials_to_dict(credentials):
    """Converts the credentials object to a dictionary to store in session."""
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes,
        'expiry': credentials.expiry.isoformat()  # Convert expiry to string for JSON
    }


@app.route('/webhook', methods=['POST'])
def sms_reply():
    """Respond to incoming SMS with a message."""
    
    incoming_message = request.form['Body']
    sender_number = request.form['From']
    print(f"Received message from {sender_number}: {incoming_message}")

    save_entry("marianne.romero30@gmail.com", LAST_MESSAGE_SENT, incoming_message, LAST_MESSAGE_SENT_TYPE)

    # add some processing to message
    response_msg = response()

    response = MessagingResponse()
    response.message(response_msg)
    return str(response)

def send_SMS(message:str, type:str):
    LAST_MESSAGE_SENT = message
    send_message("+14385038053", message)

def schedule_basic_messages():
    tz = pytz.timezone('UTC')  # Change to your timezone if needed
    now = datetime.now(tz)

    message_morning = basic_prompt("Morning")
    trigger_time_morning = datetime(year=now.year, month=now.month, day=now.day, hour=10)
    trigger = DateTrigger(run_date=trigger_time_morning)
    scheduler.add_job(send_SMS, trigger, args=[message_morning, "normal"])

    message_noon = basic_prompt("Noon")
    trigger_time_noon = datetime(year=now.year, month=now.month, day=now.day, hour=14)
    trigger = DateTrigger(run_date=trigger_time_noon)
    scheduler.add_job(send_SMS, trigger, args=[message_noon, "normal"])

    message_evening = basic_prompt("Evening")
    trigger_time_evening = datetime(year=now.year, month=now.month, day=now.day, hour=18, minute=41)
    trigger = DateTrigger(run_date=trigger_time_evening)
    scheduler.add_job(send_SMS, trigger, args=[message_evening, "normal"])

    message_night = basic_prompt("Night")
    trigger_time_night = datetime(year=now.year, month=now.month, day=now.day, hour=22)
    trigger = DateTrigger(run_date=trigger_time_night)
    scheduler.add_job(send_SMS, trigger, args=[message_night, "normal"])

def schedule_messages(events):
    schedule_basic_messages()
    for event in events:
        message = event_prompt(event['summary'])
        task_time_str = event['end']['dateTime']
        task_time = datetime.fromisoformat(task_time_str)
        trigger = DateTrigger(run_date=task_time)
        scheduler.add_job(send_SMS, trigger, args=[message, "event"])

if __name__ == '__main__':
    # Start the scheduler
    scheduler.start()
    app.run(debug=True, host='localhost', port=5000, ssl_context=('server.crt', 'private.key'))
