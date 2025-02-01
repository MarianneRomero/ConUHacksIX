from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def sms_reply():
    """Respond to incoming SMS with a message."""
    
    incoming_message = request.form['Body']
    sender_number = request.form['From']
    print(f"Received message from {sender_number}: {incoming_message}")

    # add some processing to message and come up with a response message
    response_msg = "This is a test reponse message"

    response = MessagingResponse()
    response.message(response_msg)
    return str(response)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
