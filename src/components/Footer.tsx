import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export function Footer() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState(false);

  const handleSignOut = async () => {
    console.log('🚪 Footer: Sign out clicked');
    try {
      await signOut();
      console.log('✅ Footer: Sign out successful');
      navigate('/#');
    } catch (error) {
      console.error('❌ Footer: Sign out failed:', error);
    }
  };

  const toggleDebugInfo = () => {
    setDebugInfo(!debugInfo);
    console.log('🔍 Footer: Debug info toggled:', !debugInfo);
  };

  console.log('👣 Footer render - Current location:', {
    pathname: location.pathname,
    hash: location.hash,
    search: location.search,
    full: `${location.pathname}${location.search}${location.hash}`
  });

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Lalio & Villaruz Wedding. All rights reserved.</p>
        
        {/* Debug Section */}
        <div className="mt-4 space-y-2">
          <Button 
            onClick={toggleDebugInfo}
            variant="outline" 
            size="sm"
            className="mr-2"
          >
            🔍 Debug Info
          </Button>
          
          <Button 
            onClick={() => {
              console.log('🔐 Admin button clicked - navigating to auth');
              navigate('/auth');
            }}
            variant="outline" 
            size="sm"
            className="mr-2"
          >
            🔐 Admin
          </Button>

          <Button 
            onClick={() => {
              console.log('🧪 Manual navigation to /auth');
              navigate('/auth');
            }}
            variant="outline" 
            size="sm"
            className="mr-2"
          >
            📝 Test Auth
          </Button>

          <Button 
            onClick={() => {
              console.log('🧪 Manual navigation to /debug');
              navigate('/debug');
            }}
            variant="outline" 
            size="sm"
            className="mr-2"
          >
            🐛 Debug Page
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-left text-sm">
            <h3 className="font-bold mb-2">🔍 Debug Information:</h3>
            <div className="space-y-1">
              <p><strong>Location:</strong> {location.pathname}{location.search}{location.hash}</p>
              <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>Origin:</strong> {window.location.origin}</p>
              <p><strong>Protocol:</strong> {window.location.protocol}</p>
              <p><strong>Host:</strong> {window.location.host}</p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
