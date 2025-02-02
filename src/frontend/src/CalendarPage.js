import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SecondaryEntry from './SecondaryEntry'; // Import the new component


const CalendarPage = () => {
    // State to store the currently selected date
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [normalItems, setNormalItems] = useState([]);
    const [eventItems, setEventItems] = useState([]);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };


    useEffect(() => {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD if needed
        fetch(`https://localhost:5000/getNormalEntries?date=${formattedDate}`)
            .then(response => response.json())
            .then(data => setNormalItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedDate]);  // Dependency array: Refetch whenever selectedDate changes

    useEffect(() => {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD if needed
        fetch(`https://localhost:5000/getEventEntries?date=${formattedDate}`)
            .then(response => response.json())
            .then(data => setEventItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedDate]); 

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate); // Store the selected date
    };

    return (
        <div>
            <div class="container">
                {/* Main Entry */}
                <div style={{ margin: '20px', width: '100%'}}>
                    <div class="main-entry">
                        <h1 style={{'margin-bottom': '10px'}}>{selectedDate.toLocaleDateString('en-US', options)}</h1>
                        <div class="journal-entry" style={{ width: '100%', 'overflow-y': 'scroll', 'scrollbar-width': 'none' }}>
                            {normalItems.length > 0 ? (
                                normalItems.map(item => (
                                    <div>
                                        <h3>{item.prompt}</h3>
                                        <text>{item.response}</text>
                                    </div>
                                ))
                            ): (
                                <div>
                                    <img src='\images\zen-landscape.jpg' alt="Zen Background" style={{ width: '100%', height: 'auto' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Entry */}
                <div style={{ width: '100%', margin: '20px', 'overflow-y': 'scroll', 'scrollbar-width': 'none' }}>
                    {eventItems.map(item => (
                        <div class="journal-entry">
                            <SecondaryEntry key={item.id} prompt={item.prompt} response={item.response}></SecondaryEntry> 
                        </div>
                    ))}
                </div>
                
                
                {/* Calendar + Secondary Entry */}
                <div style={{margin: '20px'}}>
                    <Calendar
                        value={date}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
