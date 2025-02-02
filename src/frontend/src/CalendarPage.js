import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SecondaryEntry from './SecondaryEntry'; // Import the new component
import MoodTracker from './mood';



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
    const [mood_data, setMoodData] = useState([]);


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


    useEffect(() => {
        fetch('https://localhost:5000/getMoodEntries')
            .then(response => response.json())
            .then((data) => {
                // Transform data into the desired format
                const transformedData = data.map(entry => ({
                    name: entry.name,  // Assuming `entry.mood` has the mood name (e.g., 'happy', 'sad')
                    count: entry.count, // Assuming `entry.count` has the count of moods
                    fill: entry.fill    // Assuming `entry.fill` has the corresponding color
                }));
                setMoodData(transformedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    
    
        useEffect(() => {
            console.log(mood_data);  // This will log whenever mood_data is updated
        }, [mood_data]);



    const handleDateChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate); // Store the selected date
    };

    return (
        <div
            style={{
                backgroundImage: "url(images/background.jpg)",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                width: '100%',
                margin: '0px',
                padding: '0',
                position: 'fixed',
            }}
        >
            <div class="container">
                {/* Main Entry */}
                <div style={{ margin: '30px', width: '100%'}}>
                    <div class="main-entry">
                        <h1 style={{'margin-bottom': '10px', 'font-size':'3rem'}}>{selectedDate.toLocaleDateString('en-US', options)}</h1>
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
                                    <img src='\images\landscape1.jpg' alt="Zen Background" style={{ width: '100%', height: 'auto', 'border-radius': '15px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Entry */}
                <div style={{ width: '100%', margin: '30px', 'overflow-y': 'scroll', 'scrollbar-width': 'none' }}>
                    <div class="journal-entry">
                        <img src='\images\flowers.jpg' alt="Landscape" style={{ width: '100%', height: 'auto', 'border-radius': '20px' }} />
                    </div>
                    {eventItems.map(item => (
                        <div class="journal-entry">
                            <SecondaryEntry key={item.id} prompt={item.prompt} response={item.response}></SecondaryEntry> 
                        </div>
                    ))}
                </div>
                
                
                {/* Calendar + Secondary Entry */}
                <div style={{margin: '20px', 'justify-items': 'center', width: '100%'}}>
                    <Calendar
                        value={date}
                        onChange={handleDateChange}
                    />
                    <h1 style={{"padding-top":'20px', "padding-bottom":'0px', 'font-size': '2.5rem'}}>Mood Tracker</h1>
                    <MoodTracker data={mood_data}/>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
