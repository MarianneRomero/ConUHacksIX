import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
from_phone_nb = os.environ["TWILIO_PHONE_NUMBER"]
client = Client(account_sid, auth_token)

def send_message(receiver_phone_nb: str, msg_content: str):
    message = client.messages.create(
        body=msg_content,
        from_=from_phone_nb,
        to=receiver_phone_nb,
    )
    print(message.body)