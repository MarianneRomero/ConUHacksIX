import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SecondaryEntry from './SecondaryEntry'; // Import the new component


const CalendarPage = () => {
    // State to store the currently selected date
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate); // Store the selected date
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '20px' }}>
            {/* Main Entry */}
            <div>
                {selectedDate && (
                    <div>
                        <h2>{selectedDate.toLocaleDateString()}</h2>
                        <p>Here you can add details for the selected date.</p>
                        {/* Example of events */}
                        <ul>
                            <li>You have no entries for today. </li>
                            {/* Add more dynamic events here */}
                        </ul>
                    </div>
                )}
            </div>

            {/* Secondary Entry */}
            <div>
                <SecondaryEntry> </SecondaryEntry>
            </div>
            
            {/* Calendar + Secondary Entry */}
            <div style={{ marginRight: '20px' }}>
                <Calendar
                    value={date}
                    onChange={handleDateChange}
                />
                <SecondaryEntry> </SecondaryEntry>
            </div>
        </div>
    );
};

export default CalendarPage;
