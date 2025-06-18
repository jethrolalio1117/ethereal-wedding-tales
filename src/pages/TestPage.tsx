import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  console.log("🧪 TestPage rendering...");
  
  React.useEffect(() => {
    console.log("🧪 TestPage mounted successfully!");
    
    // Add visual confirmation
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      background: green; 
      color: white; 
      padding: 20px; 
      border-radius: 10px; 
      font-size: 18px; 
      z-index: 10000;
      font-family: Arial;
      text-align: center;
    `;
    indicator.innerHTML = `
      <h2>🧪 TEST PAGE LOADED!</h2>
      <p>Routing is working!</p>
      <p>URL: ${window.location.href}</p>
    `;
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 5000);
  }, []);
  
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      background: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: 'green', fontSize: '3em' }}>🧪 TEST PAGE</h1>
      <p style={{ fontSize: '1.5em', margin: '20px 0' }}>
        If you can see this page, React Router is working!
      </p>
      <p style={{ fontSize: '1.2em', color: '#666' }}>
        Current URL: {window.location.href}
      </p>
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/" 
          style={{
            background: 'blue',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '10px',
            display: 'inline-block'
          }}
        >
          🏠 Go to Home
        </Link>
        <Link 
          to="/auth" 
          style={{
            background: 'red',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px',
            margin: '10px',
            display: 'inline-block'
          }}
        >
          🔐 Go to Auth
        </Link>
      </div>
    </div>
  );
};

export default TestPage; 