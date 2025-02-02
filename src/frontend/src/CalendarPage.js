import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SecondaryEntry from './SecondaryEntry'; // Import the new component


const CalendarPage = () => {
    // State to store the currently selected date
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [items, setItems] = useState([]);


    useEffect(() => {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD if needed
        fetch(`https://localhost:5000/getEvents?date=${formattedDate}`)
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedDate]);  // Dependency array: Refetch whenever selectedDate changes

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate); // Store the selected date
    };

    return (
        <journal-container style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '20px' }}>
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
            <journal-entry>
                <SecondaryEntry> 
                {items.map(item => (
                <div key={item.id} className="border rounded-xl p-4 shadow-md">
                    <h2 className="text-xl font-semibold">{item.prompt}</h2>
                    <p className="text-gray-600">{item.response}</p>
                </div>
                ))}
                </SecondaryEntry>
            </journal-entry>
            
            {/* Calendar + Secondary Entry */}
            <div style={{ marginRight: '20px' }}>
                <Calendar
                    value={date}
                    onChange={handleDateChange}
                />
                <SecondaryEntry> </SecondaryEntry>
            </div>
        </journal-container>
    );
};

export default CalendarPage;
