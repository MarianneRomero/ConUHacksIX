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
        <journal-container style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '20px' }}>
            <div class="container">
                {/* Main Entry */}
                <div>
                    {selectedDate && (
                        <div>
                            <h1>{selectedDate.toLocaleDateString()}</h1>
                            <journal-entry>
                                {normalItems.map(item => (
                                    <div>
                                        <h3>{item.prompt}</h3>
                                        <text>{item.response}</text>
                                    </div>
                                ))}
                            </journal-entry>
                        </div>
                    )}
                </div>

                {/* Secondary Entry */}
                <div>
                    <journal-entry>
                        {eventItems.map(item => (
                            <SecondaryEntry key={item.id} prompt={item.prompt} response={item.response}></SecondaryEntry> 
                        ))}
                    </journal-entry>
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
        </journal-container>
    );
};

export default CalendarPage;
