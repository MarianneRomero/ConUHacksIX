import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SecondaryEntry from './SecondaryEntry'; // Import the new component
import MoodTracker from './mood';


const fake_data = [
    {
        name: "angry",
        count: 1,
        fill: "#8dd1e1" 
      },
    {
      name: "sad",
      count: 3,
      fill: "#83a6ed"
    },
    {
      name: "calm",
      count: 6,
      fill: "#82ca9d"
    },
    {
      name: "anxious",
      count: 4,
      fill: "#a4de6c"
    },
    {
        name: "happy",
        count: 16,
        fill: "#8884d8"
    },
  ];



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
            }}
        >
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
                    <MoodTracker data={mood_data}/>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
