import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DebugPage: React.FC = () => {
  console.log("🐛 DebugPage rendering...");
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const [routingInfo, setRoutingInfo] = React.useState({
    pathname: '',
    hash: '',
    search: '',
    href: ''
  });
  
  React.useEffect(() => {
    console.log("🐛 DebugPage mounted!");
    console.log("🐛 Location object:", location);
    
    const updateInfo = () => {
      setRoutingInfo({
        pathname: location.pathname,
        hash: window.location.hash,
        search: location.search,
        href: window.location.href
      });
    };
    
    updateInfo();
    
    // Update every second
    const interval = setInterval(updateInfo, 1000);
    
    return () => clearInterval(interval);
  }, [location]);
  
  const testNavigation = (path: string) => {
    console.log(`🐛 Testing navigation to: ${path}`);
    navigate(path);
  };
  
  const testHashNavigation = (hash: string) => {
    console.log(`🐛 Testing hash navigation to: ${hash}`);
    window.location.hash = hash;
  };
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '2em' }}>🐛 DEBUG PAGE</h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        margin: '20px 0', 
        border: '2px solid red',
        borderRadius: '10px'
      }}>
        <h2>📍 Current Routing Information</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
{`Location pathname: ${routingInfo.pathname}
Window hash: ${routingInfo.hash}
Location search: ${routingInfo.search}
Full URL: ${routingInfo.href}
Timestamp: ${new Date().toLocaleTimeString()}`}
        </pre>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        margin: '20px 0', 
        border: '2px solid blue',
        borderRadius: '10px'
      }}>
        <h2>🧪 Navigation Tests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            onClick={() => testNavigation('/')}
            style={{ padding: '10px', background: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Navigate to /
          </button>
          <button 
            onClick={() => testNavigation('/test')}
            style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Navigate to /test
          </button>
          <button 
            onClick={() => testNavigation('/auth')}
            style={{ padding: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Navigate to /auth
          </button>
          <button 
            onClick={() => testHashNavigation('#/test')}
            style={{ padding: '10px', background: 'purple', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Hash to #/test
          </button>
          <button 
            onClick={() => testHashNavigation('#/auth')}
            style={{ padding: '10px', background: 'orange', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Hash to #/auth
          </button>
        </div>
      </div>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        margin: '20px 0', 
        border: '2px solid green',
        borderRadius: '10px'
      }}>
        <h2>📋 Instructions</h2>
        <ol>
          <li>Watch the routing information update in real-time</li>
          <li>Try the navigation buttons and see what happens</li>
          <li>Check the browser console for detailed logs</li>
          <li>If you see this page, HashRouter is working!</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPage; 