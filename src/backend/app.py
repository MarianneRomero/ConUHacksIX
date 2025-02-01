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

app = Flask(__name__)

app.secret_key = os.urandom(24)
CLIENT_SECRETS_FILE = "credentials_google_auth.json"
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'
REDIRECT_URI = 'https://localhost:5000/oauth2callback' 


@app.route('/')
def index():
    # Check if the user is already authenticated
    if 'credentials' in session:
        return render_template('index.html', logged_in=True)
    return render_template('index.html', logged_in=False)


@app.route('/authorize')
def authorize():
    # If credentials already exist, no need to log in again
    if 'credentials' in session:
        return redirect(url_for('get_calendar_events'))
    
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
    return redirect(url_for('get_calendar_events'))


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
    tz = pytz.timezone('UTC')  # Change to your timezone if needed
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
    return jsonify(events)



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

    # add some processing to message
    response_msg = "Thanks for sharing! This has been added to your journal entry!"

    response = MessagingResponse()
    response.message(response_msg)
    return str(response)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000, ssl_context=('server.crt', 'private.key'))
