$(document).ready(function() {
    // Check if the user is logged in by checking a session variable (or making an API request)
    if (loggedIn) {
        $('#loginButton').hide();  // Hide login button if already logged in
        $('#eventsSection').show();  // Show events section
        fetchCalendarEvents();  // Fetch calendar events
    } else {
        $('#loginButton').show();  // Show login button if not logged in
        $('#eventsSection').hide();  // Hide events section
    }

    // Handle the login button click
    $('#loginButton').click(function() {
        window.location.href = "https://localhost:5000/authorize";  // Redirect to your Flask OAuth authorization URL
    });

    // Fetch calendar events from the backend (Flask app)
    function fetchCalendarEvents() {
        $.ajax({
            url: "https://localhost:5000/get_calendar_events",  // Updated ngrok URL
            method: "GET",
            success: function(data) {
                if (data.length > 0) {
                    displayEvents(data);  // Call function to display events
                } else {
                    $('#eventsSection').html("No upcoming events found.");
                }
            },
            error: function(error) {
                console.log("Error fetching calendar events:", error);
            }
        });
    }

    // Display events in the HTML
    function displayEvents(events) {
        let eventsList = $('#eventsList');
        eventsList.empty();  // Clear any existing events

        events.forEach(function(event) {
            let eventItem = `<li>
                                <strong>${event.summary}</strong>
                                <p>${event.start.dateTime} - ${event.end.dateTime}</p>
                            </li>`;
            eventsList.append(eventItem);  // Add event to list
        });
    }
});
