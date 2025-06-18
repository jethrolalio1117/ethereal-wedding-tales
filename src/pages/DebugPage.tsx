import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('🐛 DebugPage rendered');

  const debugInfo = {
    timestamp: new Date().toISOString(),
    location: {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      key: location.key
    },
    window: {
      href: window.location.href,
      origin: window.location.origin,
      protocol: window.location.protocol,
      host: window.location.host,
      hostname: window.location.hostname,
      port: window.location.port,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    },
    document: {
      title: document.title,
      referrer: document.referrer,
      readyState: document.readyState
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          ← Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🐛 Debug Information</CardTitle>
          <CardDescription>
            Current application state and debugging information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            
            {/* Navigation Test Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-2">🧪 Navigation Tests</h3>
              <div className="space-x-2">
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline" 
                  size="sm"
                >
                  → Home
                </Button>
                <Button 
                  onClick={() => navigate('/auth')} 
                  variant="outline" 
                  size="sm"
                >
                  → Auth
                </Button>
                <Button 
                  onClick={() => navigate('/admin')} 
                  variant="outline" 
                  size="sm"
                >
                  → Admin
                </Button>
                <Button 
                  onClick={() => navigate('/test')} 
                  variant="outline" 
                  size="sm"
                >
                  → Test
                </Button>
              </div>
            </div>

            {/* Debug Information */}
            <div>
              <h3 className="text-lg font-semibold mb-2">📊 System Information</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            {/* Console Log Test */}
            <div>
              <h3 className="text-lg font-semibold mb-2">📝 Console Test</h3>
              <Button 
                onClick={() => {
                  console.log('🧪 Debug Page: Manual console log test');
                  console.warn('⚠️ Debug Page: Warning test');
                  console.error('❌ Debug Page: Error test');
                  alert('Check console for test logs!');
                }}
                variant="outline"
              >
                Test Console Logging
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
} 