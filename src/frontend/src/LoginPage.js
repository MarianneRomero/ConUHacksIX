import React, { useState } from 'react';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Trigger the backend to start the Google OAuth process
    try {
        setLoading(true);
        window.location.href = 'https://localhost:5000/authorize';
    } catch (error) {
        setLoading(false);
        console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Pensieve</h1>
      {!isLoggedIn ? (
        <div id="login-section">
          <p>Login to access your journals!</p>
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login with Google'}
          </button>
        </div>
      ) : (
        <div id="calendar-section">
          <h2>Your Upcoming Events</h2>
          {userInfo ? (
            <div>
              <p>Welcome, {userInfo.name}!</p>
              {/* You can display other user info here */}
            </div>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
