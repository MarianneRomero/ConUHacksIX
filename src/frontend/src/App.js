import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from './CalendarPage';
import LoginPage from './LoginPage';

function App() {
    return (
        <Router>
            <Routes> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<CalendarPage />} />
            </Routes>
        </Router>
    );
}

export default App;
