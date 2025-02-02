import React, { useState } from 'react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Trigger the backend to start the Google OAuth process
    try {
        window.location.href = 'https://localhost:5000/authorize';
    } catch (error) {
        console.error('Error during login:', error);
    }
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
      'justify-items': 'center',
  }}>
      
      <div style={{'padding-top': '100px'}}>
        <h1 style={{'font-size': '5rem'}}>Pensieve</h1>
      </div>
          <div>
            <img src='\images\logo.png' alt="Logo" style={{ width: '450px', height: 'auto' }} />
          </div>
          <div style={{'margin-bottom': '10px'}}>
            <h2 style={{'font-size': '2.5rem'}}>Login to access your journals!</h2>
          </div>
          <div>
            <button onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login with Google'}
            </button>
          </div>
        </div>
  );
};

export default LoginPage;
